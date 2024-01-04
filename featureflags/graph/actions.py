from datetime import datetime
from uuid import UUID, uuid4

from aiopg.sa import SAConnection
from sqlalchemy import and_, or_, select, update
from sqlalchemy.dialects.postgresql import insert

from featureflags.graph.constants import AUTH_SESSION_TTL
from featureflags.graph.metrics import track
from featureflags.graph.types import (
    Action,
    AddCheckOp,
    AddConditionOp,
    Changes,
    DirtyProjects,
    LocalId,
)
from featureflags.graph.utils import update_map
from featureflags.models import (
    AuthSession,
    AuthUser,
    Changelog,
    Check,
    Condition,
    Flag,
    LocalIdMap,
    Operator,
    Project,
    Variable,
)
from featureflags.services.auth import UserSession, auth_required
from featureflags.services.ldap import BaseLDAP
from featureflags.utils import select_scalar


async def gen_id(local_id: LocalId, *, db_connection: SAConnection):
    assert local_id.scope and local_id.value, local_id

    id_ = await select_scalar(
        db_connection,
        (
            insert(LocalIdMap.__table__)
            .values(
                {
                    LocalIdMap.scope: local_id.scope,
                    LocalIdMap.value: local_id.value,
                    LocalIdMap.id: uuid4(),
                    LocalIdMap.timestamp: datetime.utcnow(),
                }
            )
            .on_conflict_do_nothing()
            .returning(LocalIdMap.id)
        ),
    )
    if id_ is None:
        id_ = await select_scalar(
            db_connection,
            (
                select([LocalIdMap.id]).where(
                    and_(
                        LocalIdMap.scope == local_id.scope,
                        LocalIdMap.value == local_id.value,
                    )
                )
            ),
        )
    return id_


async def get_auth_user(username: str, *, db_connection: SAConnection) -> UUID:
    user_id_select = select([AuthUser.id]).where(AuthUser.username == username)
    user_id = await select_scalar(db_connection, user_id_select)
    if user_id is None:
        user_id = await select_scalar(
            db_connection,
            (
                insert(AuthUser.__table__)
                .values(
                    {
                        AuthUser.id: uuid4(),
                        AuthUser.username: username,
                    }
                )
                .on_conflict_do_nothing()
                .returning(AuthUser.id)
            ),
        )
        if user_id is None:
            user_id = await select_scalar(db_connection, user_id_select)
            assert user_id is not None
    return user_id


@track
async def sign_in(
    username: str,
    password: str,
    *,
    db_connection: SAConnection,
    session: UserSession,
    ldap: BaseLDAP,
) -> bool:
    assert username and password, "Username and password are required"
    if not await ldap.check_credentials(username, password):
        return False

    user_id = await get_auth_user(username, db_connection=db_connection)

    now = datetime.utcnow()
    expiration_time = now + AUTH_SESSION_TTL
    await db_connection.execute(
        insert(AuthSession.__table__)
        .values(
            {
                AuthSession.session: session.ident,
                AuthSession.auth_user: user_id,
                AuthSession.creation_time: now,
                AuthSession.expiration_time: expiration_time,
            }
        )
        .on_conflict_do_update(
            index_elements=[AuthSession.session],
            set_={
                AuthSession.auth_user.name: user_id,
                AuthSession.expiration_time.name: expiration_time,
            },
        )
    )

    session.sign_in(user_id, expiration_time)
    return True


@track
async def sign_out(
    *, db_connection: SAConnection, session: UserSession
) -> None:
    if session.ident:
        await db_connection.execute(
            AuthSession.__table__.delete().where(
                AuthSession.session == session.ident
            )
        )
        session.sign_out()


@auth_required
@track
async def enable_flag(
    flag_id: str,
    *,
    db_connection: SAConnection,
    dirty: DirtyProjects,
    changes: Changes,
) -> None:
    assert flag_id, "Flag id is required"

    flag_id = UUID(hex=flag_id)
    await db_connection.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: True})
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.ENABLE_FLAG)


@auth_required
@track
async def disable_flag(
    flag_id: str,
    *,
    db_connection: SAConnection,
    dirty: DirtyProjects,
    changes: Changes,
) -> None:
    assert flag_id, "Flag id is required"

    flag_id = UUID(hex=flag_id)
    await db_connection.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: False})
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.DISABLE_FLAG)


@auth_required
@track
async def reset_flag(
    flag_id: str,
    *,
    db_connection: SAConnection,
    dirty: DirtyProjects,
    changes: Changes,
) -> None:
    assert flag_id, "Flag id is required"

    flag_id = UUID(hex=flag_id)
    await db_connection.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: None})
    )
    await db_connection.execute(
        Condition.__table__.delete().where(Condition.flag == flag_id)
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.RESET_FLAG)


@auth_required
@track
async def delete_flag(
    flag_id: str, *, db_connection: SAConnection, changes: Changes
) -> None:
    assert flag_id, "Flag id is required"

    flag_id = UUID(hex=flag_id)
    await db_connection.execute(
        Condition.__table__.delete().where(Condition.flag == flag_id)
    )
    await db_connection.execute(
        Flag.__table__.delete().where(Flag.id == flag_id)
    )

    changes.add(flag_id, Action.DELETE_FLAG)


@auth_required
@track
async def add_check(
    op: AddCheckOp, *, db_connection: SAConnection, dirty: DirtyProjects
) -> dict[LocalId, UUID]:
    id_ = await gen_id(op.local_id, db_connection=db_connection)
    variable_id = UUID(hex=op.variable)
    values = {
        Check.id: id_,
        Check.variable: variable_id,
        Check.operator: Operator(op.operator),
    }
    values.update(Check.value_from_op(op))
    await db_connection.execute(
        insert(Check.__table__).values(values).on_conflict_do_nothing()
    )
    dirty.by_variable.add(variable_id)
    return {op.local_id: id_}


@auth_required
@track
async def add_condition(
    op: AddConditionOp,
    *,
    db_connection: SAConnection,
    ids: dict,
    dirty: DirtyProjects,
    changes: Changes,
) -> dict:
    id_ = await gen_id(op.local_id, db_connection=db_connection)

    flag_id = UUID(hex=op.flag_id)
    checks = [
        ids[check.local_id] if check.local_id else UUID(hex=check.id)
        for check in op.checks
    ]

    await db_connection.execute(
        insert(Condition.__table__)
        .values(
            {
                Condition.id: id_,
                Condition.flag: flag_id,
                Condition.checks: checks,
            }
        )
        .on_conflict_do_nothing()
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.ADD_CONDITION)
    return update_map(ids, {op.local_id: id_})


@auth_required
@track
async def disable_condition(
    condition_id: str,
    *,
    db_connection: SAConnection,
    dirty: DirtyProjects,
    changes: Changes,
) -> None:
    assert condition_id, "Condition id is required"

    condition_id = UUID(hex=condition_id)
    flag_id = await select_scalar(
        db_connection,
        (
            Condition.__table__.delete()
            .where(Condition.id == condition_id)
            .returning(Condition.flag)
        ),
    )
    if flag_id is not None:
        dirty.by_flag.add(flag_id)
        changes.add(flag_id, Action.DISABLE_CONDITION)


async def postprocess(
    *, db_connection: SAConnection, dirty: DirtyProjects
) -> None:
    selections = []
    for flag_id in dirty.by_flag:
        selections.append(select([Flag.project]).where(Flag.id == flag_id))
    for variable_id in dirty.by_variable:
        selections.append(
            select([Variable.project]).where(Variable.id == variable_id)
        )
    if selections:
        await db_connection.execute(
            update(Project.__table__)
            .where(or_(*[Project.id.in_(sel) for sel in selections]))
            .values({Project.version: Project.version + 1})
        )


async def update_changelog(
    *, session: UserSession, db_connection: SAConnection, changes: Changes
) -> None:
    actions = changes.get_actions()
    if actions:
        assert session.user is not None
        for flag, flag_actions in actions:
            assert flag_actions, repr(flag_actions)
            await db_connection.execute(
                insert(Changelog.__table__).values(
                    {
                        Changelog.timestamp: datetime.utcnow(),
                        Changelog.auth_user: session.user,
                        Changelog.flag: flag,
                        Changelog.actions: flag_actions,
                    }
                )
            )
