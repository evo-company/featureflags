from datetime import datetime, timedelta

import faker
import pytest

from sqlalchemy import and_, func, select, exists

from featureflags.server import auth
from featureflags.server.ldap import DummyLDAP
from featureflags.server.utils import sel_scalar
from featureflags.server.schema import LocalIdMap, Flag, Project
from featureflags.server.schema import Check, Operator, Condition
from featureflags.server.schema import AuthSession, AuthUser, Action
from featureflags.server.schema import Changelog
from featureflags.server.actions import gen_id, enable_flag, disable_flag
from featureflags.server.actions import add_check, add_condition, DirtyProjects
from featureflags.server.actions import disable_condition, postprocess
from featureflags.server.actions import reset_flag, Changes
from featureflags.server.actions import sign_in, sign_out, AccessError
from featureflags.server.actions import update_changelog
from featureflags.server.actions import LocalId
from featureflags.server.actions import AddCheckOp
from featureflags.server.actions import AddConditionOp
from featureflags.server.actions import with_session

from tests.state import (
    mk_project,
    mk_flag,
    mk_variable,
    mk_auth_user,
    mk_check,
    mk_condition,
    mk_auth_session,
)


f = faker.Faker()


@pytest.fixture(name="dirty")
def dirty_fixture():
    return DirtyProjects()


@pytest.fixture(name="changes")
def changes_fixture():
    return Changes()


async def get_version(project, *, db):
    result = await db.execute(
        select([Project.version]).where(Project.id == project)
    )
    return await result.scalar()


async def check_flag(flag, *, db):
    result = await db.execute(select([Flag.enabled]).where(Flag.id == flag))
    return await result.scalar()


@pytest.mark.asyncio
async def test_sign_in_new(db):
    username = "user@host.com"
    password = "trust-me"

    user_id = await sel_scalar(
        db, (select([AuthUser.id]).where(AuthUser.username == username))
    )
    assert user_id is None

    session = auth.Session(None, auth.EmptyAccessToken(), secret="secret")
    assert session.get_access_token() is None

    await sign_in(
        username, password, db=db, session=session, ldap=DummyLDAP(bound=True)
    )

    assert session.ident
    assert session.is_authenticated
    assert session.user
    assert session.get_access_token()

    expiration_time = await sel_scalar(
        db,
        (
            select([AuthSession.expiration_time]).where(
                AuthSession.session == session.ident
            )
        ),
    )
    assert expiration_time is not None
    assert expiration_time > datetime.utcnow() + timedelta(minutes=1)

    user_id = await sel_scalar(
        db, (select([AuthUser.id]).where(AuthUser.username == username))
    )
    assert user_id is not None
    assert user_id == session.user


@pytest.mark.asyncio
async def test_sign_in_existent(db):
    user = await mk_auth_user(db)
    password = "trust-me"

    session = auth.Session(None, auth.EmptyAccessToken(), secret="secret")
    assert session.get_access_token() is None

    await sign_in(
        user.username,
        password,
        db=db,
        session=session,
        ldap=DummyLDAP(bound=True),
    )

    assert session.ident
    assert session.is_authenticated
    assert session.user == user.id
    assert session.get_access_token()


@pytest.mark.asyncio
async def test_sign_in_invalid(db):
    username = "user@host.com"
    password = "trust-me"

    session = auth.Session(None, auth.EmptyAccessToken(), secret="secret")
    assert session.get_access_token() is None

    await sign_in(
        username, password, db=db, session=session, ldap=DummyLDAP(bound=False)
    )

    assert session.ident is None
    assert session.get_access_token() is None


@pytest.mark.asyncio
async def test_sign_out(db):
    auth_session = await mk_auth_session(db)

    r1 = await db.execute(
        select([AuthSession.expiration_time]).where(
            AuthSession.session == auth_session.session
        )
    )
    assert await r1.fetchall() == [(auth_session.expiration_time,)]

    session = auth.Session(
        auth_session.session,
        auth.ValidAccessToken(auth_session.auth_user),
        secret="secret",
    )
    assert session.get_access_token() is None

    await sign_out(db=db, session=session)

    access_token = session.get_access_token()
    assert access_token
    session = await auth.get_session(access_token, db=db, secret="secret")
    assert session.is_authenticated is False

    r2 = await db.execute(
        select([AuthSession.expiration_time]).where(
            AuthSession.session == auth_session.session
        )
    )
    assert await r2.fetchall() == []


@pytest.mark.asyncio
async def test_gen_id(db):
    local_id = LocalId(scope="marston", value="minuit")

    async def get_count():
        result = await db.execute(
            select([func.count("*")]).where(
                and_(
                    LocalIdMap.scope == local_id.scope,
                    LocalIdMap.value == local_id.value,
                )
            )
        )
        return await result.scalar()

    assert await get_count() == 0
    id1 = await gen_id(local_id, db=db)
    id2 = await gen_id(local_id, db=db)
    id3 = await gen_id(local_id, db=db)
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
    db, dirty, changes, action, before, after, action_type
):
    flag = await mk_flag(db, enabled=before)
    assert await check_flag(flag.id, db=db) == before
    session = auth.TestSession(1)

    async with with_session(session):
        await action(flag_id=flag.id.hex, db=db, dirty=dirty, changes=changes)
    assert dirty.by_flag == {flag.id}
    assert changes.get_actions() == [(flag.id, [action_type])]
    assert await check_flag(flag.id, db=db) is after


@pytest.mark.asyncio
async def test_reset_flag(db, dirty, changes):
    project = await mk_project(db)
    flag = await mk_flag(db, enabled=True, project=project)
    condition = await mk_condition(db, flag=flag, project=project)

    session = auth.TestSession(1)

    async with with_session(session):
        assert await check_flag(flag.id, db=db) is True
    assert (
        await (
            await db.execute(
                select([exists().where(Condition.id == condition.id)])
            )
        ).scalar()
        is True
    )

    async with with_session(session):
        await reset_flag(
            flag_id=flag.id.hex, db=db, dirty=dirty, changes=changes
        )
    assert dirty.by_flag == {flag.id}
    assert changes.get_actions() == [(flag.id, [Action.RESET_FLAG])]

    async with with_session(session):
        assert await check_flag(flag.id, db=db) is None
    assert (
        await (
            await db.execute(
                select([exists().where(Condition.id == condition.id)])
            )
        ).scalar()
        is False
    )


@pytest.mark.asyncio
async def test_add_check(db, dirty):
    variable = await mk_variable(db)

    local_id = LocalId(scope="spatted", value="widget")

    session = auth.TestSession(1)

    async with with_session(session):
        ids = await add_check(
            AddCheckOp(
                dict(
                    local_id=dict(scope="spatted", value="widget"),
                    variable=variable.id.hex,
                    operator=Operator.EQUAL.value,
                    kind="value_string",
                    value_string="sandino",
                )
            ),
            db=db,
            dirty=dirty,
        )
    assert dirty.by_variable == {variable.id}

    id_ = ids[local_id]

    result = await db.execute(
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
async def test_add_condition(db, dirty, changes):
    project = await mk_project(db)
    flag = await mk_flag(db, project=project)
    check = await mk_check(db, variable_project=project)

    local_id = LocalId(scope="arra", value="sowle")

    session = auth.TestSession(1)

    async with with_session(session):
        ids = await add_condition(
            AddConditionOp(
                dict(
                    local_id=dict(scope="arra", value="sowle"),
                    flag_id=flag.id.hex,
                    checks=[dict(id=check.id.hex)],
                )
            ),
            db=db,
            ids={},
            dirty=dirty,
            changes=changes,
        )
    assert dirty.by_flag == {flag.id}
    assert changes.get_actions() == [(flag.id, [Action.ADD_CONDITION])]

    id_ = ids[local_id]

    result = await db.execute(
        select([Condition.flag, Condition.checks]).where(Condition.id == id_)
    )
    row = await result.first()
    assert row.as_tuple() == (flag.id, (check.id,))


@pytest.mark.asyncio
async def test_add_condition_and_check(db, dirty, changes):
    project = await mk_project(db)
    flag = await mk_flag(db, project=project)
    check1 = await mk_check(db, variable_project=project)
    check2 = await mk_check(db, variable_project=project)

    check1_id = LocalId(scope="peggy", value="caseful")

    ids = {check1_id: check1.id}

    local_id = LocalId(scope="focal", value="klutzes")

    op = AddConditionOp(
        dict(
            local_id=dict(scope=local_id.scope, value=local_id.value),
            flag_id=flag.id.hex,
            checks=[
                dict(
                    local_id=dict(
                        scope=check1_id.scope,
                        value=check1_id.value,
                    ),
                ),
                dict(id=check2.id.hex),
            ],
        )
    )

    session = auth.TestSession(1)

    async with with_session(session):
        ids.update(
            await add_condition(
                op, db=db, ids=ids, dirty=dirty, changes=changes
            )
        )
    assert dirty.by_flag == {flag.id}
    assert changes.get_actions() == [(flag.id, [Action.ADD_CONDITION])]

    id_ = ids[local_id]

    result = await db.execute(
        select([Condition.flag, Condition.checks]).where(Condition.id == id_)
    )
    row = await result.first()
    assert row.as_tuple() == (flag.id, (check1.id, check2.id))


@pytest.mark.asyncio
async def test_disable_condition(db, dirty, changes):
    condition = await mk_condition(db)

    async def check_condition():
        result = await db.execute(
            select([Condition.id]).where(Condition.id == condition.id)
        )
        row = await result.first()
        return row and row[0]

    assert (await check_condition()) == condition.id

    session = auth.TestSession(1)

    async with with_session(session):
        await disable_condition(
            condition.id.hex, db=db, dirty=dirty, changes=changes
        )
    assert dirty.by_flag == {condition.flag}
    assert changes.get_actions() == [
        (condition.flag, [Action.DISABLE_CONDITION])
    ]

    assert (await check_condition()) is None

    async with with_session(session):
        await disable_condition(
            condition.id.hex, db=db, dirty=dirty, changes=changes
        )
    # should be the same
    assert changes.get_actions() == [
        (condition.flag, [Action.DISABLE_CONDITION])
    ]

    assert (await check_condition()) is None


@pytest.mark.asyncio
async def test_postprocess_by_flag(db, dirty):
    version = f.pyint()
    project = await mk_project(db, version=version)
    flag = await mk_flag(db, project=project)
    dirty.by_flag.add(flag.id)
    await postprocess(db=db, dirty=dirty)
    assert await get_version(project.id, db=db) == version + 1


@pytest.mark.asyncio
async def test_postprocess_by_variable(db, dirty):
    version = f.pyint()
    project = await mk_project(db, version=version)
    variable = await mk_variable(db, project=project)
    dirty.by_variable.add(variable.id)
    await postprocess(db=db, dirty=dirty)
    assert await get_version(project.id, db=db) == version + 1


@pytest.mark.asyncio
async def test_postprocess_by_all(db, dirty):
    version = f.pyint()
    project = await mk_project(db, version=version)
    project_dub = await mk_project(db, version=version)

    flag = await mk_flag(db, project=project)
    dirty.by_flag.add(flag.id)

    variable = await mk_variable(db, project=project)
    dirty.by_variable.add(variable.id)

    await postprocess(db=db, dirty=dirty)
    assert await get_version(project.id, db=db) == version + 1
    assert await get_version(project_dub.id, db=db) == version


@pytest.mark.asyncio
async def test_update_changelog(db):
    flag = await mk_flag(db)
    user = await mk_auth_user(db)
    session = auth.TestSession(user.id)

    changes = Changes()
    changes.add(flag.id, Action.ENABLE_FLAG)
    changes.add(flag.id, Action.ADD_CONDITION)
    changes.add(flag.id, Action.DISABLE_CONDITION)
    changes.add(flag.id, Action.ADD_CONDITION)

    await update_changelog(session=session, db=db, changes=changes)

    actions = await sel_scalar(
        db, (select([Changelog.actions]).where(Changelog.flag == flag.id))
    )
    assert actions == (
        Action.ENABLE_FLAG,
        Action.ADD_CONDITION,
        Action.DISABLE_CONDITION,
        Action.ADD_CONDITION,
    )
