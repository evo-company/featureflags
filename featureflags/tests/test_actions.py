from datetime import datetime, timedelta

import faker
import pytest
from sqlalchemy import and_, exists, func, select

from featureflags.graph.actions import (
    AddCheckOp,
    AddConditionOp,
    AddValueConditionOp,
    Changes,
    LocalId,
    add_check,
    add_condition,
    add_value_condition,
    disable_condition,
    disable_flag,
    disable_value,
    disable_value_condition,
    enable_flag,
    enable_value,
    gen_id,
    postprocess,
    reset_flag,
    reset_value,
    sign_in,
    sign_out,
    update_changelog,
    update_value_changelog,
    update_value_value_override,
)
from featureflags.graph.types import ValueAction, ValuesChanges
from featureflags.models import (
    Action,
    AuthSession,
    AuthUser,
    Changelog,
    Check,
    Condition,
    Flag,
    LocalIdMap,
    Operator,
    Project,
    Value,
    ValueChangelog,
    ValueCondition,
)
from featureflags.services import auth
from featureflags.services.auth import (
    EmptyAccessTokenState,
    UserSession,
    ValidAccessTokenState,
    create_user_session,
)
from featureflags.services.ldap import DummyLDAP
from featureflags.tests.state import (
    mk_auth_session,
    mk_auth_user,
    mk_check,
    mk_condition,
    mk_flag,
    mk_project,
    mk_value,
    mk_value_condition,
    mk_variable,
)
from featureflags.utils import select_scalar

f = faker.Faker()


async def get_version(project, *, conn):
    result = await conn.execute(
        select([Project.version]).where(Project.id == project)
    )
    return await result.scalar()


async def check_flag(flag, *, conn):
    result = await conn.execute(select([Flag.enabled]).where(Flag.id == flag))
    return await result.scalar()


async def check_value(value, *, conn):
    result = await conn.execute(
        select([Value.enabled]).where(Value.id == value)
    )
    return await result.scalar()


async def check_value_override(value, *, conn):
    result = await conn.execute(
        select([Value.value_override]).where(Value.id == value)
    )
    return await result.scalar()


@pytest.mark.asyncio
async def test_sign_in_new(conn):
    username = "user@host.com"
    password = "trust-me"

    user_id = await select_scalar(
        conn,
        (select([AuthUser.id]).where(AuthUser.username == username)),
    )
    assert user_id is None

    session = UserSession(
        ident=None,
        state=EmptyAccessTokenState(user=None),
        secret="secret",
    )
    assert session.get_access_token() is None

    await sign_in(
        username,
        password,
        conn=conn,
        session=session,
        ldap=DummyLDAP(user_is_bound=True),
    )

    assert session.ident
    assert session.is_authenticated
    assert session.user
    assert session.get_access_token()

    expiration_time = await select_scalar(
        conn,
        (
            select([AuthSession.expiration_time]).where(
                AuthSession.session == session.ident
            )
        ),
    )
    assert expiration_time is not None
    assert expiration_time > datetime.utcnow() + timedelta(minutes=1)

    user_id = await select_scalar(
        conn,
        (select([AuthUser.id]).where(AuthUser.username == username)),
    )
    assert user_id is not None
    assert user_id == session.user


@pytest.mark.asyncio
async def test_sign_in_existent(conn, db_engine):
    user = await mk_auth_user(db_engine)
    password = "trust-me"

    session = UserSession(
        ident=None,
        state=EmptyAccessTokenState(user=None),
        secret="secret",
    )
    assert session.get_access_token() is None

    await sign_in(
        user.username,
        password,
        conn=conn,
        session=session,
        ldap=DummyLDAP(user_is_bound=True),
    )

    assert session.ident
    assert session.is_authenticated
    assert session.user == user.id
    assert session.get_access_token()


@pytest.mark.asyncio
async def test_sign_in_invalid(conn):
    username = "user@host.com"
    password = "trust-me"

    session = UserSession(
        ident=None,
        state=EmptyAccessTokenState(user=None),
        secret="secret",
    )
    assert session.get_access_token() is None

    await sign_in(
        username,
        password,
        conn=conn,
        session=session,
        ldap=DummyLDAP(user_is_bound=False),
    )
    assert session.get_access_token() is None


@pytest.mark.asyncio
async def test_sign_out(conn, db_engine):
    auth_session = await mk_auth_session(db_engine)

    r1 = await conn.execute(
        select([AuthSession.expiration_time]).where(
            AuthSession.session == auth_session.session
        )
    )
    assert await r1.fetchall() == [(auth_session.expiration_time,)]

    session = UserSession(
        ident=auth_session.session,
        state=ValidAccessTokenState(auth_session.auth_user),
        secret="secret",
    )
    assert session.get_access_token() is None

    await sign_out(conn=conn, session=session)

    access_token = session.get_access_token()
    assert access_token
    session = await create_user_session(
        access_token=access_token,
        engine=db_engine,
        secret="secret",
    )
    assert session.is_authenticated is False

    r2 = await conn.execute(
        select([AuthSession.expiration_time]).where(
            AuthSession.session == auth_session.session
        )
    )
    assert await r2.fetchall() == []


@pytest.mark.asyncio
async def test_gen_id(conn):
    local_id = LocalId(scope="marston", value="minuit")

    async def get_count():
        result = await conn.execute(
            select([func.count("*")]).where(
                and_(
                    LocalIdMap.scope == local_id.scope,
                    LocalIdMap.value == local_id.value,
                )
            )
        )
        return await result.scalar()

    assert await get_count() == 0
    id1 = await gen_id(local_id, conn=conn)
    id2 = await gen_id(local_id, conn=conn)
    id3 = await gen_id(local_id, conn=conn)
    assert id1 == id2 == id3
    assert await get_count() == 1


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "action, before, after, action_type",
    [
        (enable_flag, None, True, Action.ENABLE_FLAG),
        (enable_flag, False, True, Action.ENABLE_FLAG),
        (disable_flag, None, False, Action.DISABLE_FLAG),
        (disable_flag, True, False, Action.DISABLE_FLAG),
    ],
)
async def test_switching_flag(
    conn,
    db_engine,
    dirty_projects,
    changes,
    action,
    before,
    after,
    action_type,
):
    flag = await mk_flag(db_engine, enabled=before)
    assert await check_flag(flag.id, conn=conn) == before

    await action(
        flag_id=flag.id.hex,
        conn=conn,
        dirty=dirty_projects,
        changes=changes,
    )
    assert dirty_projects.by_flag == {flag.id}
    assert changes.get_actions() == [(flag.id, [action_type])]
    assert await check_flag(flag.id, conn=conn) is after


@pytest.mark.asyncio
async def test_reset_flag(conn, db_engine, dirty_projects, changes):
    project = await mk_project(db_engine)
    flag = await mk_flag(db_engine, enabled=True, project=project)
    condition = await mk_condition(db_engine, flag=flag, project=project)

    assert await check_flag(flag.id, conn=conn) is True
    assert (
        await (
            await conn.execute(
                select([exists().where(Condition.id == condition.id)])
            )
        ).scalar()
        is True
    )

    await reset_flag(
        flag_id=flag.id.hex,
        conn=conn,
        dirty=dirty_projects,
        changes=changes,
    )
    assert dirty_projects.by_flag == {flag.id}
    assert changes.get_actions() == [(flag.id, [Action.RESET_FLAG])]

    assert await check_flag(flag.id, conn=conn) is None
    assert (
        await (
            await conn.execute(
                select([exists().where(Condition.id == condition.id)])
            )
        ).scalar()
        is False
    )


@pytest.mark.asyncio
async def test_add_check(conn, db_engine, dirty_projects):
    variable = await mk_variable(db_engine)

    local_id = LocalId(scope="spatted", value="widget")

    ids = await add_check(
        AddCheckOp(
            {
                "local_id": {"scope": "spatted", "value": "widget"},
                "variable": variable.id.hex,
                "operator": Operator.EQUAL.value,
                "kind": "value_string",
                "value_string": "sandino",
            }
        ),
        conn=conn,
        dirty=dirty_projects,
    )
    assert dirty_projects.by_variable == {variable.id}

    id_ = ids[local_id]

    result = await conn.execute(
        select(
            [
                Check.variable,
                Check.operator,
                Check.value_string,
                Check.value_number,
                Check.value_timestamp,
                Check.value_set,
            ]
        ).where(Check.id == id_)
    )
    row = await result.first()
    assert row.as_tuple() == (
        variable.id,
        Operator.EQUAL,
        "sandino",
        None,
        None,
        None,
    )


@pytest.mark.asyncio
async def test_add_condition(conn, db_engine, dirty_projects, changes):
    project = await mk_project(db_engine)
    flag = await mk_flag(db_engine, project=project)
    check = await mk_check(db_engine, variable_project=project)

    local_id = LocalId(scope="arra", value="sowle")

    ids = await add_condition(
        AddConditionOp(
            {
                "local_id": {"scope": "arra", "value": "sowle"},
                "flag_id": flag.id.hex,
                "checks": [{"id": check.id.hex}],
            }
        ),
        conn=conn,
        ids={},
        dirty=dirty_projects,
        changes=changes,
    )
    assert dirty_projects.by_flag == {flag.id}
    assert changes.get_actions() == [(flag.id, [Action.ADD_CONDITION])]

    id_ = ids[local_id]

    result = await conn.execute(
        select([Condition.flag, Condition.checks]).where(Condition.id == id_)
    )
    row = await result.first()
    assert row.as_tuple() == (flag.id, (check.id,))


@pytest.mark.asyncio
async def test_add_condition_and_check(
    db_engine, conn, dirty_projects, changes
):
    project = await mk_project(db_engine)
    flag = await mk_flag(db_engine, project=project)
    check1 = await mk_check(db_engine, variable_project=project)
    check2 = await mk_check(db_engine, variable_project=project)

    check1_id = LocalId(scope="peggy", value="caseful")

    ids = {check1_id: check1.id}

    local_id = LocalId(scope="focal", value="klutzes")

    op = AddConditionOp(
        {
            "local_id": {"scope": local_id.scope, "value": local_id.value},
            "flag_id": flag.id.hex,
            "checks": [
                {
                    "local_id": {
                        "scope": check1_id.scope,
                        "value": check1_id.value,
                    },
                },
                {"id": check2.id.hex},
            ],
        }
    )

    ids.update(
        await add_condition(
            op,
            conn=conn,
            ids=ids,
            dirty=dirty_projects,
            changes=changes,
        )
    )
    assert dirty_projects.by_flag == {flag.id}
    assert changes.get_actions() == [(flag.id, [Action.ADD_CONDITION])]

    id_ = ids[local_id]

    result = await conn.execute(
        select([Condition.flag, Condition.checks]).where(Condition.id == id_)
    )
    row = await result.first()
    assert row.as_tuple() == (flag.id, (check1.id, check2.id))


@pytest.mark.asyncio
async def test_disable_condition(conn, db_engine, dirty_projects, changes):
    condition = await mk_condition(db_engine)

    async def check_condition():
        result = await conn.execute(
            select([Condition.id]).where(Condition.id == condition.id)
        )
        row = await result.first()
        return row and row[0]

    assert (await check_condition()) == condition.id

    await disable_condition(
        condition.id.hex,
        conn=conn,
        dirty=dirty_projects,
        changes=changes,
    )
    assert dirty_projects.by_flag == {condition.flag}
    assert changes.get_actions() == [
        (condition.flag, [Action.DISABLE_CONDITION])
    ]

    assert (await check_condition()) is None

    await disable_condition(
        condition.id.hex,
        conn=conn,
        dirty=dirty_projects,
        changes=changes,
    )
    # should be the same
    assert changes.get_actions() == [
        (condition.flag, [Action.DISABLE_CONDITION])
    ]

    assert (await check_condition()) is None


@pytest.mark.asyncio
async def test_postprocess_by_flag(conn, db_engine, dirty_projects):
    version = f.pyint()
    project = await mk_project(db_engine, version=version)
    flag = await mk_flag(db_engine, project=project)
    dirty_projects.by_flag.add(flag.id)
    await postprocess(conn=conn, dirty=dirty_projects)
    assert await get_version(project.id, conn=conn) == version + 1


@pytest.mark.asyncio
async def test_postprocess_by_variable(conn, db_engine, dirty_projects):
    version = f.pyint()
    project = await mk_project(db_engine, version=version)
    variable = await mk_variable(db_engine, project=project)
    dirty_projects.by_variable.add(variable.id)
    await postprocess(conn=conn, dirty=dirty_projects)
    assert await get_version(project.id, conn=conn) == version + 1


@pytest.mark.asyncio
async def test_postprocess_by_all(conn, db_engine, dirty_projects):
    version = f.pyint()
    project = await mk_project(db_engine, version=version)
    project_dub = await mk_project(db_engine, version=version)

    flag = await mk_flag(db_engine, project=project)
    dirty_projects.by_flag.add(flag.id)

    variable = await mk_variable(db_engine, project=project)
    dirty_projects.by_variable.add(variable.id)

    value = await mk_value(db_engine, project=project)
    dirty_projects.by_value.add(value.id)

    await postprocess(conn=conn, dirty=dirty_projects)
    assert await get_version(project.id, conn=conn) == version + 1
    assert await get_version(project_dub.id, conn=conn) == version


@pytest.mark.asyncio
async def test_update_changelog(conn, db_engine):
    flag = await mk_flag(db_engine)
    user = await mk_auth_user(db_engine)
    session = auth.TestSession(user.id)

    changes = Changes()
    changes.add(flag.id, Action.ENABLE_FLAG)
    changes.add(flag.id, Action.ADD_CONDITION)
    changes.add(flag.id, Action.DISABLE_CONDITION)
    changes.add(flag.id, Action.ADD_CONDITION)

    await update_changelog(session=session, conn=conn, changes=changes)

    actions = await select_scalar(
        conn,
        (select([Changelog.actions]).where(Changelog.flag == flag.id)),
    )
    assert actions == (
        Action.ENABLE_FLAG,
        Action.ADD_CONDITION,
        Action.DISABLE_CONDITION,
        Action.ADD_CONDITION,
    )


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "action, before, after, action_type",
    [
        (enable_value, None, True, ValueAction.ENABLE_VALUE),
        (enable_value, False, True, ValueAction.ENABLE_VALUE),
        (disable_value, None, False, ValueAction.DISABLE_VALUE),
        (disable_value, True, False, ValueAction.DISABLE_VALUE),
    ],
)
async def test_switching_value(
    conn,
    db_engine,
    dirty_projects,
    values_changes,
    action,
    before,
    after,
    action_type,
):
    value = await mk_value(db_engine, enabled=before)
    assert await check_value(value.id, conn=conn) == before

    await action(
        value_id=value.id.hex,
        conn=conn,
        dirty=dirty_projects,
        changes=values_changes,
    )
    assert dirty_projects.by_value == {value.id}
    assert values_changes.get_actions() == [(value.id, [action_type])]
    assert await check_value(value.id, conn=conn) is after


@pytest.mark.asyncio
async def test_reset_value(conn, db_engine, dirty_projects, values_changes):
    project = await mk_project(db_engine)
    value_default = "blabla"
    value_override = "notblabla"
    value = await mk_value(
        db_engine,
        enabled=True,
        project=project,
        value_default=value_default,
        value_override=value_override,
    )
    condition = await mk_value_condition(
        db_engine,
        value=value,
        project=project,
        value_override="value_override",
    )

    assert await check_value(value.id, conn=conn) is True
    assert (
        await (
            await conn.execute(
                select([exists().where(ValueCondition.id == condition.id)])
            )
        ).scalar()
        is True
    )

    await reset_value(
        value_id=value.id.hex,
        conn=conn,
        dirty=dirty_projects,
        changes=values_changes,
    )
    assert dirty_projects.by_value == {value.id}
    assert values_changes.get_actions() == [
        (value.id, [ValueAction.RESET_VALUE])
    ]

    assert await check_value_override(value.id, conn=conn) == value_default
    assert (
        await (
            await conn.execute(
                select([exists().where(ValueCondition.id == condition.id)])
            )
        ).scalar()
        is False
    )


@pytest.mark.asyncio
async def test_add_value_condition(
    conn, db_engine, dirty_projects, values_changes
):
    project = await mk_project(db_engine)
    value = await mk_value(db_engine, project=project)
    check = await mk_check(db_engine, variable_project=project)

    local_id = LocalId(scope="arra", value="sowle")

    ids = await add_value_condition(
        AddValueConditionOp(
            {
                "local_id": {"scope": "arra", "value": "sowle"},
                "value_id": value.id.hex,
                "checks": [{"id": check.id.hex}],
            }
        ),
        conn=conn,
        ids={},
        value_override="override_value",
        dirty=dirty_projects,
        changes=values_changes,
    )
    assert dirty_projects.by_value == {value.id}
    assert values_changes.get_actions() == [
        (value.id, [ValueAction.ADD_CONDITION])
    ]

    id_ = ids[local_id]

    result = await conn.execute(
        select(
            [
                ValueCondition.value,
                ValueCondition.checks,
                ValueCondition.value_override,
            ]
        ).where(ValueCondition.id == id_)
    )
    row = await result.first()
    assert row.as_tuple() == (value.id, (check.id,), "override_value")


@pytest.mark.asyncio
async def test_add_value_condition_and_check(
    db_engine, conn, dirty_projects, values_changes
):
    project = await mk_project(db_engine)
    value = await mk_value(db_engine, project=project)
    check1 = await mk_check(db_engine, variable_project=project)
    check2 = await mk_check(db_engine, variable_project=project)

    check1_id = LocalId(scope="peggy", value="caseful")

    ids = {check1_id: check1.id}

    local_id = LocalId(scope="focal", value="klutzes")

    op = AddValueConditionOp(
        {
            "local_id": {"scope": local_id.scope, "value": local_id.value},
            "value_id": value.id.hex,
            "checks": [
                {
                    "local_id": {
                        "scope": check1_id.scope,
                        "value": check1_id.value,
                    },
                },
                {"id": check2.id.hex},
            ],
        }
    )

    ids.update(
        await add_value_condition(
            op,
            conn=conn,
            ids=ids,
            dirty=dirty_projects,
            changes=values_changes,
            value_override="override_value",
        )
    )
    assert dirty_projects.by_value == {value.id}
    assert values_changes.get_actions() == [
        (value.id, [ValueAction.ADD_CONDITION])
    ]

    id_ = ids[local_id]

    result = await conn.execute(
        select(
            [
                ValueCondition.value,
                ValueCondition.checks,
                ValueCondition.value_override,
            ]
        ).where(ValueCondition.id == id_)
    )
    row = await result.first()
    assert row.as_tuple() == (
        value.id,
        (check1.id, check2.id),
        "override_value",
    )


@pytest.mark.asyncio
async def test_disable_value_condition(
    conn, db_engine, dirty_projects, values_changes
):
    condition = await mk_value_condition(db_engine)

    async def check_condition():
        result = await conn.execute(
            select([ValueCondition.id]).where(ValueCondition.id == condition.id)
        )
        row = await result.first()
        return row and row[0]

    assert (await check_condition()) == condition.id

    await disable_value_condition(
        condition.id.hex,
        conn=conn,
        dirty=dirty_projects,
        changes=values_changes,
    )
    assert dirty_projects.by_value == {condition.value}
    assert values_changes.get_actions() == [
        (condition.value, [ValueAction.DISABLE_CONDITION])
    ]

    assert (await check_condition()) is None

    await disable_value_condition(
        condition.id.hex,
        conn=conn,
        dirty=dirty_projects,
        changes=values_changes,
    )
    # should be the same
    assert values_changes.get_actions() == [
        (condition.value, [ValueAction.DISABLE_CONDITION])
    ]

    assert (await check_condition()) is None


@pytest.mark.asyncio
async def test_postprocess_by_value(conn, db_engine, dirty_projects):
    version = f.pyint()
    project = await mk_project(db_engine, version=version)
    value = await mk_value(db_engine, project=project)
    dirty_projects.by_value.add(value.id)
    await postprocess(conn=conn, dirty=dirty_projects)
    assert await get_version(project.id, conn=conn) == version + 1


@pytest.mark.asyncio
async def test_update_value_changelog(conn, db_engine):
    value = await mk_value(db_engine)
    user = await mk_auth_user(db_engine)
    session = auth.TestSession(user.id)

    changes = ValuesChanges()
    changes.add(value.id, ValueAction.ENABLE_VALUE)
    changes.add(value.id, ValueAction.ADD_CONDITION)
    changes.add(value.id, ValueAction.DISABLE_CONDITION)
    changes.add(value.id, ValueAction.ADD_CONDITION)

    await update_value_changelog(session=session, conn=conn, changes=changes)

    actions = await select_scalar(
        conn,
        (
            select([ValueChangelog.actions]).where(
                ValueChangelog.value == value.id
            )
        ),
    )
    assert actions == (
        ValueAction.ENABLE_VALUE,
        ValueAction.ADD_CONDITION,
        ValueAction.DISABLE_CONDITION,
        ValueAction.ADD_CONDITION,
    )


@pytest.mark.asyncio
async def test_update_value_value_override(
    conn, db_engine, dirty_projects, values_changes
):
    project = await mk_project(db_engine)
    value_default = "blabla"
    value_override = "notblabla"

    value = await mk_value(
        db_engine,
        enabled=True,
        project=project,
        value_default=value_default,
        value_override=value_default,
    )

    await update_value_value_override(
        value.id.hex,
        value_override=value_override,
        conn=conn,
        dirty=dirty_projects,
        changes=values_changes,
    )

    assert await check_value_override(value.id, conn=conn) == value_override
