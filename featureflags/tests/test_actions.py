from datetime import datetime, timedelta

import faker
import pytest
from sqlalchemy import and_, exists, func, select

from featureflags.graph.actions import (
    AddCheckOp,
    AddConditionOp,
    Changes,
    LocalId,
    add_check,
    add_condition,
    disable_condition,
    disable_flag,
    enable_flag,
    gen_id,
    postprocess,
    reset_flag,
    sign_in,
    sign_out,
    update_changelog,
)
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
