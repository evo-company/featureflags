from datetime import datetime
from uuid import uuid4

import pytest
from hiku.builder import Q, build
from hiku.result import denormalize

from featureflags.graph.graph import GRAPH, exec_graph
from featureflags.graph.types import Action, ValueAction
from featureflags.graph.utils import is_valid_uuid
from featureflags.services.auth import (
    EmptyAccessTokenState,
    ExpiredAccessTokenState,
    SignedOutState,
    UnknownState,
    UserSession,
    ValidAccessTokenState,
)
from featureflags.tests.state import (
    mk_auth_user,
    mk_changelog_entry,
    mk_check,
    mk_condition,
    mk_flag,
    mk_notification_channel,
    mk_project,
    mk_project_notification_channel,
    mk_value,
    mk_value_changelog_entry,
    mk_value_condition,
    mk_variable,
)


@pytest.mark.parametrize(
    "value, result",
    [
        (uuid4().hex, True),
        (str(uuid4()), True),
        ("invalid", False),
    ],
)
def test_is_uuid(value, result):
    assert is_valid_uuid(value) is result


@pytest.mark.asyncio
async def test_root_flag_invalid(db_engine, graph_engine, test_session):
    query = build(
        [
            Q.flag(id=str(uuid4()))[Q.id,],
        ]
    )
    result = await exec_graph(graph_engine, query, db_engine, test_session)
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
async def test_flags(
    enabled, overridden, db_engine, graph_engine, test_session
):
    project = await mk_project(db_engine)
    variable = await mk_variable(db_engine, project=project)
    flag = await mk_flag(db_engine, enabled=enabled, project=project)
    check = await mk_check(db_engine, variable=variable)
    condition = await mk_condition(db_engine, flag=flag, checks=[check.id])

    # generate some other flag in other project
    await mk_flag(db_engine)

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
    result = await exec_graph(graph_engine, query, db_engine, test_session)
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


@pytest.mark.asyncio
async def test_flags_by_ids(db_engine, graph_engine, test_session):
    flag = await mk_flag(db_engine)
    # generate some other flag
    await mk_flag(db_engine)

    query = build(
        [
            Q.flags_by_ids(ids=["invalid", flag.id.hex, "invalid"])[
                Q.id,
                Q.name,
            ],
        ]
    )
    result = await exec_graph(graph_engine, query, db_engine, test_session)
    assert denormalize(GRAPH, result) == {
        "flags_by_ids": [
            {
                "id": flag.id,
                "name": flag.name,
            },
        ],
    }


@pytest.mark.asyncio
async def test_projects(db_engine, graph_engine, test_session):
    project = await mk_project(db_engine)
    variable = await mk_variable(db_engine, project=project)

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
    result = await exec_graph(graph_engine, query, db_engine, test_session)
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


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "state, value",
    [
        (UnknownState(user=None), False),
        (ValidAccessTokenState(uuid4()), True),
        (
            ExpiredAccessTokenState(
                user=uuid4(),
                secret="secret",
                ident="session_key",
                session_exp=datetime.utcnow(),
            ),
            True,
        ),
        (
            SignedOutState(user=None, ident="session_key", secret="secret"),
            False,
        ),
        (EmptyAccessTokenState(user=None), False),
    ],
)
async def test_authenticated(state, value, db_engine, graph_engine):
    query = build([Q.authenticated])

    user_session = UserSession(ident=None, state=state, secret="secret")
    result = await exec_graph(graph_engine, query, db_engine, user_session)

    assert result["authenticated"] is value


@pytest.mark.asyncio
async def test_changes(db_engine, graph_engine, test_session):
    flag = await mk_flag(db_engine)
    auth_user = await mk_auth_user(db_engine)
    entry = await mk_changelog_entry(db_engine, flag=flag, auth_user=auth_user)
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
    result = await exec_graph(graph_engine, query, db_engine, test_session)
    plain_result = denormalize(GRAPH, result)
    assert plain_result["changes"][0] == {  # 0 == latest
        "id": entry.id,
        "timestamp": entry.timestamp,
        "actions": (),
        "flag": {"name": flag.name},
        "user": {"username": auth_user.username},
    }


@pytest.mark.asyncio
async def test_changes_by_project_ids(db_engine, graph_engine, test_session):
    flag = await mk_flag(db_engine)
    auth_user = await mk_auth_user(db_engine)
    entry = await mk_changelog_entry(
        db_engine, flag=flag, auth_user=auth_user, actions=[Action.RESET_FLAG]
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
    r1 = await exec_graph(graph_engine, q1, db_engine, test_session)
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
    r2 = await exec_graph(graph_engine, q2, db_engine, test_session)
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


@pytest.mark.asyncio
async def test_root_value_invalid(db_engine, graph_engine, test_session):
    query = build(
        [
            Q.value(id=str(uuid4()))[Q.id,],
        ]
    )
    result = await exec_graph(graph_engine, query, db_engine, test_session)
    assert denormalize(GRAPH, result) == {"value": None}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "enabled, overridden",
    [
        (None, False),
        (True, True),
        (False, True),
    ],
)
async def test_values(
    enabled, overridden, db_engine, graph_engine, test_session
):
    value_default = "test_values_value_default"
    value_override = "test_values_value_override"
    value_condition_override = "test_values_value_condition_override"

    project = await mk_project(db_engine)
    variable = await mk_variable(db_engine, project=project)
    value = await mk_value(
        db_engine,
        enabled=enabled,
        project=project,
        value_default=value_default,
        value_override=value_override,
    )
    check = await mk_check(db_engine, variable=variable)
    condition = await mk_value_condition(
        db_engine,
        value=value,
        checks=[check.id],
        value_override=value_condition_override,
    )

    # generate some other value in other project
    await mk_value(db_engine)

    query = build(
        [
            Q.values(project_name=project.name)[
                Q.id,
                Q.name,
                Q.value_default,
                Q.value_override,
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
                    Q.value_override,
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
    result = await exec_graph(graph_engine, query, db_engine, test_session)
    assert denormalize(GRAPH, result) == {
        "values": [
            {
                "id": value.id,
                "name": value.name,
                "value_default": value.value_default,
                "value_override": value.value_override,
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
                "enabled": value.enabled or False,
                "conditions": [
                    {
                        "id": condition.id,
                        "value_override": condition.value_override,
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


@pytest.mark.asyncio
async def test_values_by_ids(db_engine, graph_engine, test_session):
    value = await mk_value(db_engine)
    # generate some other value
    await mk_value(db_engine)

    query = build(
        [
            Q.values_by_ids(ids=["invalid", value.id.hex, "invalid"])[
                Q.id,
                Q.name,
            ],
        ]
    )
    result = await exec_graph(graph_engine, query, db_engine, test_session)
    assert denormalize(GRAPH, result) == {
        "values_by_ids": [
            {
                "id": value.id,
                "name": value.name,
            },
        ],
    }


@pytest.mark.asyncio
async def test_value_changes(db_engine, graph_engine, test_session):
    value = await mk_value(db_engine)
    auth_user = await mk_auth_user(db_engine)
    entry = await mk_value_changelog_entry(
        db_engine, value=value, auth_user=auth_user
    )
    query = build(
        [
            Q.valueChanges[
                Q.id,
                Q.timestamp,
                Q.actions,
                Q.value[Q.name],
                Q.user[Q.username],
            ],
        ]
    )
    result = await exec_graph(graph_engine, query, db_engine, test_session)
    plain_result = denormalize(GRAPH, result)
    assert plain_result["valueChanges"][0] == {  # 0 == latest
        "id": entry.id,
        "timestamp": entry.timestamp,
        "actions": (),
        "value": {"name": value.name},
        "user": {"username": auth_user.username},
    }


@pytest.mark.asyncio
async def test_value_changes_by_project_ids(
    db_engine, graph_engine, test_session
):
    value = await mk_value(db_engine)
    auth_user = await mk_auth_user(db_engine)
    entry = await mk_value_changelog_entry(
        db_engine,
        value=value,
        auth_user=auth_user,
        actions=[ValueAction.RESET_VALUE],
    )
    q1 = build(
        [
            Q.valueChanges(project_ids=[])[
                Q.id,
                Q.timestamp,
                Q.actions,
                Q.value[Q.name],
                Q.user[Q.username],
            ],
        ]
    )
    r1 = await exec_graph(graph_engine, q1, db_engine, test_session)
    assert denormalize(GRAPH, r1) == {"valueChanges": []}

    q2 = build(
        [
            Q.valueChanges(project_ids=[value.project])[
                Q.id,
                Q.timestamp,
                Q.actions,
                Q.value[Q.name],
                Q.user[Q.username],
            ],
        ]
    )
    r2 = await exec_graph(graph_engine, q2, db_engine, test_session)
    assert denormalize(GRAPH, r2) == {
        "valueChanges": [
            {
                "id": entry.id,
                "timestamp": entry.timestamp,
                "actions": (ValueAction.RESET_VALUE,),
                "value": {
                    "name": value.name,
                },
                "user": {
                    "username": auth_user.username,
                },
            },
        ],
    }


@pytest.mark.asyncio
async def test_notification_channels(db_engine, graph_engine, test_session):
    channel = await mk_notification_channel(db_engine)

    query = build(
        [
            Q.notificationChannels[
                Q.id,
                Q.name,
                Q.webhook_url,
            ],
        ]
    )
    result = await exec_graph(graph_engine, query, db_engine, test_session)
    data = denormalize(GRAPH, result)

    assert data == {
        "notificationChannels": [
            {
                "id": channel.id,
                "name": channel.name,
                "webhook_url": channel.webhook_url,
            }
        ]
    }


@pytest.mark.asyncio
async def test_project_notification_channels(
    db_engine, graph_engine, test_session
):
    project = await mk_project(db_engine)
    channel = await mk_notification_channel(db_engine)
    await mk_project_notification_channel(
        db_engine, project=project, channel=channel
    )
    # another project without channels
    other_project = await mk_project(db_engine)

    query = build(
        [
            Q.projects[
                Q.id,
                Q.notificationChannels[
                    Q.id,
                    Q.name,
                ],
            ],
        ]
    )
    result = await exec_graph(graph_engine, query, db_engine, test_session)
    data = denormalize(GRAPH, result)

    by_id = {p["id"]: p for p in data["projects"]}
    assert by_id[project.id]["notificationChannels"] == [
        {"id": channel.id, "name": channel.name}
    ]
    assert by_id[other_project.id]["notificationChannels"] == []
