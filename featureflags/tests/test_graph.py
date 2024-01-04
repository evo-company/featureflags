from uuid import uuid4
from datetime import datetime

import pytest

from hiku.result import denormalize
from hiku.builder import build, Q
from google.protobuf.wrappers_pb2 import BoolValue

from featureflags_protobuf import graph_pb2

from featureflags.services import auth
from featureflags.graph.graph import GRAPH, exec_graph, _is_uuid
from featureflags.graph.proto_adapter import populate_result_proto
from featureflags.graph.types import Action

from state import mk_condition, mk_project, mk_variable, mk_flag, mk_auth_user
from state import mk_check, mk_changelog_entry


@pytest.mark.parametrize(
    "value, result",
    [
        (uuid4().hex, True),
        (str(uuid4()), True),
        ("invalid", False),
    ],
)
def test_is_uuid(value, result):
    assert _is_uuid(value) is result


@pytest.mark.asyncio
async def test_root_flag_invalid(sa, hiku_engine):
    query = build(
        [
            Q.flag(id="invalid-uuid")[Q.id,],
        ]
    )
    result = await exec_graph(
        hiku_engine, query, sa=sa, session=auth.TestSession(uuid4())
    )
    assert denormalize(GRAPH, result) == {"flag": None}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "enabled, overridden",
    [
        (None, False),
        (True, True),
        (False, True),
    ],
)
async def test_flags(enabled, overridden, db, sa, hiku_engine):
    project = await mk_project(db)
    variable = await mk_variable(db, project=project)
    flag = await mk_flag(db, enabled=enabled, project=project)
    check = await mk_check(db, variable=variable)
    condition = await mk_condition(db, flag=flag, checks=[check.id])

    # generate some other flag in other project
    await mk_flag(db)

    query = build(
        [
            Q.flags(project_name=project.name)[
                Q.id,
                Q.name,
                Q.project[
                    Q.id,
                    Q.name,
                    Q.variables[
                        Q.id,
                        Q.name,
                        Q.type,
                    ],
                ],
                Q.enabled,
                Q.conditions[
                    Q.id,
                    Q.checks[
                        Q.id,
                        Q.variable[
                            Q.id,
                            Q.name,
                            Q.type,
                        ],
                        Q.operator,
                        Q.value_string,
                        Q.value_number,
                        Q.value_timestamp,
                        Q.value_set,
                    ],
                ],
                Q.overridden,
            ],
        ]
    )
    result = await exec_graph(
        hiku_engine, query, sa=sa, session=auth.TestSession(uuid4())
    )
    assert denormalize(GRAPH, result) == {
        "flags": [
            {
                "id": flag.id,
                "name": flag.name,
                "project": {
                    "id": project.id,
                    "name": project.name,
                    "variables": [
                        {
                            "id": variable.id,
                            "name": variable.name,
                            "type": variable.type,
                        },
                    ],
                },
                "enabled": flag.enabled or False,
                "conditions": [
                    {
                        "id": condition.id,
                        "checks": [
                            {
                                "id": check.id,
                                "variable": {
                                    "id": variable.id,
                                    "name": variable.name,
                                    "type": variable.type,
                                },
                                "operator": check.operator,
                                "value_string": check.value_string,
                                "value_number": None,
                                "value_timestamp": None,
                                "value_set": None,
                            },
                        ],
                    },
                ],
                "overridden": overridden,
            },
        ],
    }

    assert populate_result_proto(result, graph_pb2.Result()) == graph_pb2.Result(
        Root=graph_pb2.Root(
            flags=[graph_pb2.Ref(Flag=flag.id.hex)],
        ),
        Project={
            project.id.hex: graph_pb2.Project(
                id=project.id.hex,
                name=project.name,
                variables=[graph_pb2.Ref(Variable=variable.id.hex)],
            ),
        },
        Variable={
            variable.id.hex: graph_pb2.Variable(
                id=variable.id.hex,
                name=variable.name,
                type=variable.type.to_pb(),
            ),
        },
        Flag={
            flag.id.hex: graph_pb2.Flag(
                id=flag.id.hex,
                name=flag.name,
                project=graph_pb2.Ref(Project=flag.project.hex),
                enabled=BoolValue(value=flag.enabled or False),
                conditions=[graph_pb2.Ref(Condition=condition.id.hex)],
                overridden=BoolValue(value=overridden),
            ),
        },
        Condition={
            condition.id.hex: graph_pb2.Condition(
                id=condition.id.hex,
                checks=[graph_pb2.Ref(Check=check.id.hex)],
            ),
        },
        Check={
            check.id.hex: graph_pb2.Check(
                id=check.id.hex,
                variable=graph_pb2.Ref(Variable=variable.id.hex),
                operator=check.operator.to_pb(),
                value_string=check.value_string,
            ),
        },
    )


@pytest.mark.asyncio
async def test_flags_by_ids(db, sa, hiku_engine):
    flag = await mk_flag(db)
    # generate some other flag
    await mk_flag(db)

    query = build(
        [
            Q.flags_by_ids(ids=["invalid", flag.id.hex, "invalid"])[
                Q.id,
                Q.name,
            ],
        ]
    )
    result = await exec_graph(
        hiku_engine, query, sa=sa, session=auth.TestSession(uuid4())
    )
    assert denormalize(GRAPH, result) == {
        "flags_by_ids": [
            {
                "id": flag.id,
                "name": flag.name,
            },
        ],
    }
    assert populate_result_proto(result, graph_pb2.Result()) == graph_pb2.Result(
        Root=graph_pb2.Root(
            flags_by_ids=[graph_pb2.Ref(Flag=flag.id.hex)],
        ),
        Flag={
            flag.id.hex: graph_pb2.Flag(
                id=flag.id.hex,
                name=flag.name,
            ),
        },
    )


@pytest.mark.asyncio
async def test_projects(db, sa, hiku_engine):
    project = await mk_project(db)
    variable = await mk_variable(db, project=project)

    query = build(
        [
            Q.projects[
                Q.id,
                Q.name,
                Q.variables[
                    Q.id,
                    Q.name,
                    Q.type,
                ],
            ]
        ]
    )
    result = await exec_graph(
        hiku_engine, query, sa=sa, session=auth.TestSession(uuid4())
    )
    plain_result = denormalize(GRAPH, result)
    expected = {
        "id": project.id,
        "name": project.name,
        "variables": [
            {
                "id": variable.id,
                "name": variable.name,
                "type": variable.type,
            }
        ],
    }
    assert any(p == expected for p in plain_result["projects"])

    result_proto = populate_result_proto(result, graph_pb2.Result())
    assert graph_pb2.Ref(Project=project.id.hex) in result_proto.Root.projects
    assert result_proto.Project[project.id.hex] == graph_pb2.Project(
        id=project.id.hex,
        name=project.name,
        variables=[graph_pb2.Ref(Variable=variable.id.hex)],
    )
    assert result_proto.Variable[variable.id.hex] == graph_pb2.Variable(
        id=variable.id.hex,
        name=variable.name,
        type=variable.type.to_pb(),
    )


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "state, value",
    [
        (auth.Unknown(), False),
        (auth.ValidAccessToken(uuid4()), True),
        (
            auth.ExpiredAccessToken(
                uuid4(), "secret", "session_key", datetime.utcnow()
            ),
            True,
        ),
        (auth.SignedOutSession("session_key", "secret"), False),
        (auth.EmptyAccessToken(), False),
    ],
)
async def test_authenticated(state, value, sa, hiku_engine):
    query = build([Q.authenticated])
    session = auth.Session(None, state, secret="secret")
    result = await exec_graph(hiku_engine, query, sa=sa, session=session)
    assert result["authenticated"] is value
    result_proto = populate_result_proto(result, graph_pb2.Result())
    assert result_proto.Root.authenticated is value


@pytest.mark.asyncio
async def test_changes(db, hiku_engine, sa):
    flag = await mk_flag(db)
    auth_user = await mk_auth_user(db)
    entry = await mk_changelog_entry(db, flag=flag, auth_user=auth_user)
    query = build(
        [
            Q.changes[
                Q.id,
                Q.timestamp,
                Q.actions,
                Q.flag[Q.name],
                Q.user[Q.username],
            ],
        ]
    )
    session = auth.TestSession(uuid4())
    result = await exec_graph(hiku_engine, query, sa=sa, session=session)
    plain_result = denormalize(GRAPH, result)
    assert plain_result["changes"][0] == {  # 0 == latest
        "id": entry.id,
        "timestamp": entry.timestamp,
        "actions": tuple(),
        "flag": {"name": flag.name},
        "user": {"username": auth_user.username},
    }


@pytest.mark.asyncio
async def test_changes_by_project_ids(db, hiku_engine, sa):
    session = auth.TestSession(uuid4())
    flag = await mk_flag(db)
    auth_user = await mk_auth_user(db)
    entry = await mk_changelog_entry(
        db, flag=flag, auth_user=auth_user, actions=[Action.RESET_FLAG]
    )
    q1 = build(
        [
            Q.changes(project_ids=[])[
                Q.id,
                Q.timestamp,
                Q.actions,
                Q.flag[Q.name],
                Q.user[Q.username],
            ],
        ]
    )
    r1 = await exec_graph(hiku_engine, q1, sa=sa, session=session)
    assert denormalize(GRAPH, r1) == {"changes": []}

    q2 = build(
        [
            Q.changes(project_ids=[flag.project])[
                Q.id,
                Q.timestamp,
                Q.actions,
                Q.flag[Q.name],
                Q.user[Q.username],
            ],
        ]
    )
    r2 = await exec_graph(hiku_engine, q2, sa=sa, session=session)
    assert denormalize(GRAPH, r2) == {
        "changes": [
            {
                "id": entry.id,
                "timestamp": entry.timestamp,
                "actions": (Action.RESET_FLAG,),
                "flag": {
                    "name": flag.name,
                },
                "user": {
                    "username": auth_user.username,
                },
            },
        ],
    }
