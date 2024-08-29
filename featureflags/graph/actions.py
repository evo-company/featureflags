from datetime import datetime
from uuid import UUID

from aiopg.sa import SAConnection
from sqlalchemy import or_, select, update
from sqlalchemy.dialects.postgresql import insert

from featureflags.graph.constants import AUTH_SESSION_TTL
from featureflags.graph.metrics import track
from featureflags.graph.types import (
    Action,
    AddCheckOp,
    AddConditionOp,
    AddValueConditionOp,
    Changes,
    DirtyProjects,
    LocalId,
    ValueAction,
    ValuesChanges,
)
from featureflags.graph.utils import gen_id, get_auth_user, update_map
from featureflags.models import (
    AuthSession,
    Changelog,
    Check,
    Condition,
    Flag,
    Operator,
    Project,
    Value,
    ValueChangelog,
    ValueCondition,
    Variable,
)
from featureflags.services.auth import UserSession, auth_required
from featureflags.services.ldap import BaseLDAP
from featureflags.utils import select_scalar


@track
async def sign_in(
    username: str,
    password: str,
    *,
    conn: SAConnection,
    session: UserSession,
    ldap: BaseLDAP,
) -> tuple[bool, str | None]:
    assert username and password, "Username and password are required"
    is_success, error_msg = await ldap.check_credentials(username, password)
    if not is_success:
        return False, error_msg

    user_id = await get_auth_user(username, conn=conn)

    now = datetime.utcnow()
    expiration_time = now + AUTH_SESSION_TTL
    await conn.execute(
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
    return True, None


@track
async def sign_out(*, conn: SAConnection, session: UserSession) -> None:
    if session.ident:
        await conn.execute(
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
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: Changes,
) -> None:
    assert flag_id, "Flag id is required"

    flag_uuid = UUID(hex=flag_id)
    await conn.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_uuid)
        .values({Flag.enabled: True})
    )
    dirty.by_flag.add(flag_uuid)
    changes.add(flag_uuid, Action.ENABLE_FLAG)


@auth_required
@track
async def disable_flag(
    flag_id: str,
    *,
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: Changes,
) -> None:
    assert flag_id, "Flag id is required"

    flag_uuid = UUID(hex=flag_id)
    await conn.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_uuid)
        .values({Flag.enabled: False})
    )
    dirty.by_flag.add(flag_uuid)
    changes.add(flag_uuid, Action.DISABLE_FLAG)


@auth_required
@track
async def reset_flag(
    flag_id: str,
    *,
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: Changes,
) -> None:
    assert flag_id, "Flag id is required"

    flag_uuid = UUID(hex=flag_id)
    await conn.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_uuid)
        .values({Flag.enabled: None})
    )
    await conn.execute(
        Condition.__table__.delete().where(Condition.flag == flag_uuid)
    )
    dirty.by_flag.add(flag_uuid)
    changes.add(flag_uuid, Action.RESET_FLAG)


@auth_required
@track
async def delete_flag(
    flag_id: str, *, conn: SAConnection, changes: Changes
) -> None:
    assert flag_id, "Flag id is required"

    flag_uuid = UUID(hex=flag_id)
    await conn.execute(
        Condition.__table__.delete().where(Condition.flag == flag_uuid)
    )
    await conn.execute(Flag.__table__.delete().where(Flag.id == flag_uuid))

    changes.add(flag_uuid, Action.DELETE_FLAG)


@auth_required
@track
async def add_check(
    op: AddCheckOp, *, conn: SAConnection, dirty: DirtyProjects
) -> dict[LocalId, UUID]:
    id_ = await gen_id(op.local_id, conn=conn)
    variable_id = UUID(hex=op.variable)
    values = {
        Check.id: id_,
        Check.variable: variable_id,
        Check.operator: Operator(op.operator),
    }
    values.update(Check.value_from_op(op))  # type: ignore
    await conn.execute(
        insert(Check.__table__).values(values).on_conflict_do_nothing()
    )
    dirty.by_variable.add(variable_id)
    return {op.local_id: id_}


@auth_required
@track
async def add_condition(
    op: AddConditionOp,
    *,
    conn: SAConnection,
    ids: dict,
    dirty: DirtyProjects,
    changes: Changes,
) -> dict:
    id_ = await gen_id(op.local_id, conn=conn)

    flag_id = UUID(hex=op.flag_id)
    checks = [
        ids[check.local_id] if check.local_id else UUID(hex=check.id)
        for check in op.checks
    ]

    await conn.execute(
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
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: Changes,
) -> None:
    assert condition_id, "Condition id is required"

    flag_id = await select_scalar(
        conn,
        (
            Condition.__table__.delete()
            .where(Condition.id == UUID(hex=condition_id))
            .returning(Condition.flag)
        ),
    )
    if flag_id is not None:
        dirty.by_flag.add(flag_id)
        changes.add(flag_id, Action.DISABLE_CONDITION)


async def postprocess(*, conn: SAConnection, dirty: DirtyProjects) -> None:
    selections = []
    for flag_id in dirty.by_flag:
        selections.append(select([Flag.project]).where(Flag.id == flag_id))
    for variable_id in dirty.by_variable:
        selections.append(
            select([Variable.project]).where(Variable.id == variable_id)
        )
    for value_id in dirty.by_value:
        selections.append(select([Value.project]).where(Value.id == value_id))
    if selections:
        await conn.execute(
            update(Project.__table__)
            .where(or_(*[Project.id.in_(sel) for sel in selections]))
            .values({Project.version: Project.version + 1})
        )


async def update_changelog(
    *, session: UserSession, conn: SAConnection, changes: Changes
) -> None:
    actions = changes.get_actions()
    if actions:
        assert session.user is not None
        for flag, flag_actions in actions:
            assert flag_actions, repr(flag_actions)
            await conn.execute(
                insert(Changelog.__table__).values(
                    {
                        Changelog.timestamp: datetime.utcnow(),
                        Changelog.auth_user: session.user,
                        Changelog.flag: flag,
                        Changelog.actions: flag_actions,
                    }
                )
            )


@auth_required
@track
async def enable_value(
    value_id: str,
    *,
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: ValuesChanges,
) -> None:
    assert value_id, "Value id is required"

    value_uuid = UUID(hex=value_id)
    await conn.execute(
        Value.__table__.update()
        .where(Value.id == value_uuid)
        .values({Value.enabled: True})
    )
    dirty.by_value.add(value_uuid)
    changes.add(value_uuid, ValueAction.ENABLE_VALUE)


@auth_required
@track
async def update_value_value_override(
    value_id: str,
    value_override: str,
    *,
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: ValuesChanges,
) -> None:
    assert value_id, "Value id is required"

    value_uuid = UUID(hex=value_id)
    await conn.execute(
        Value.__table__.update()
        .where(Value.id == value_uuid)
        .values({Value.value_override: value_override})
    )
    dirty.by_value.add(value_uuid)
    changes.add(value_uuid, ValueAction.UPDATE_VALUE_VALUE_OVERRIDE)


@auth_required
@track
async def disable_value(
    value_id: str,
    *,
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: ValuesChanges,
) -> None:
    assert value_id, "Value id is required"

    value_uuid = UUID(hex=value_id)
    await conn.execute(
        Value.__table__.update()
        .where(Value.id == value_uuid)
        .values({Value.enabled: False})
    )
    dirty.by_value.add(value_uuid)
    changes.add(value_uuid, ValueAction.DISABLE_VALUE)


@auth_required
@track
async def reset_value(
    value_id: str,
    *,
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: ValuesChanges,
) -> None:
    assert value_id, "Value id is required"

    value_uuid = UUID(hex=value_id)

    result = await conn.execute(
        select([Value.value_default]).where(Value.id == value_uuid)
    )
    value_default = await result.scalar()

    await conn.execute(
        Value.__table__.update()
        .where(Value.id == value_uuid)
        .values(
            {
                Value.value_override: value_default,
                Value.enabled: None,
            }
        )
    )
    await conn.execute(
        ValueCondition.__table__.delete().where(
            ValueCondition.value == value_uuid
        )
    )
    dirty.by_value.add(value_uuid)
    changes.add(value_uuid, ValueAction.RESET_VALUE)


@auth_required
@track
async def delete_value(
    value_id: str, *, conn: SAConnection, changes: ValuesChanges
) -> None:
    assert value_id, "Value id is required"

    value_uuid = UUID(hex=value_id)
    await conn.execute(
        ValueCondition.__table__.delete().where(
            ValueCondition.value == value_uuid
        )
    )
    await conn.execute(Value.__table__.delete().where(Value.id == value_uuid))

    changes.add(value_uuid, ValueAction.DELETE_VALUE)


@auth_required
@track
async def add_value_condition(
    op: AddValueConditionOp,
    *,
    conn: SAConnection,
    ids: dict,
    value_override: str,
    dirty: DirtyProjects,
    changes: ValuesChanges,
) -> dict:
    id_ = await gen_id(op.local_id, conn=conn)

    value_id = UUID(hex=op.value_id)
    checks = [
        ids[check.local_id] if check.local_id else UUID(hex=check.id)
        for check in op.checks
    ]

    await conn.execute(
        insert(ValueCondition.__table__)
        .values(
            {
                ValueCondition.id: id_,
                ValueCondition.value: value_id,
                ValueCondition.checks: checks,
                ValueCondition.value_override: value_override,
            }
        )
        .on_conflict_do_nothing()
    )
    dirty.by_value.add(value_id)
    changes.add(value_id, ValueAction.ADD_CONDITION)
    return update_map(ids, {op.local_id: id_})


@auth_required
@track
async def disable_value_condition(
    condition_id: str,
    *,
    conn: SAConnection,
    dirty: DirtyProjects,
    changes: ValuesChanges,
) -> None:
    assert condition_id, "Condition id is required"

    value_id = await select_scalar(
        conn,
        (
            ValueCondition.__table__.delete()
            .where(ValueCondition.id == UUID(hex=condition_id))
            .returning(ValueCondition.value)
        ),
    )
    if value_id is not None:
        dirty.by_value.add(value_id)
        changes.add(value_id, ValueAction.DISABLE_CONDITION)


async def update_value_changelog(
    *, session: UserSession, conn: SAConnection, changes: ValuesChanges
) -> None:
    actions = changes.get_actions()
    if actions:
        assert session.user is not None
        for value, value_actions in actions:
            assert value_actions, repr(value_actions)
            await conn.execute(
                insert(ValueChangelog.__table__).values(
                    {
                        ValueChangelog.timestamp: datetime.utcnow(),
                        ValueChangelog.auth_user: session.user,
                        ValueChangelog.value: value,
                        ValueChangelog.actions: value_actions,
                    }
                )
            )
