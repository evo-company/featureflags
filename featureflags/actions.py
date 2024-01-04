import contextlib
from contextvars import ContextVar
from dataclasses import dataclass
from uuid import uuid4, UUID
from typing import (
    List,
    Dict,
    Optional,
    Union,
)
from datetime import datetime, timedelta
from collections import defaultdict

from aiopg.sa import SAConnection
from sqlalchemy import select, and_, update, or_
from prometheus_client import Histogram, Counter
from sqlalchemy.dialects.postgresql import insert

from featureflags import metrics
from featureflags.utils import sel_scalar
from featureflags.schema import Operator, Project, Variable, AuthSession, AuthUser
from featureflags.schema import Flag, Check, LocalIdMap, Condition, Action, Changelog


action_time = Histogram(
    "action_time",
    "Action latency (seconds)",
    ["action"],
    buckets=(0.010, 0.050, 0.100, 1.000, float("inf")),
)

action_errors = Counter(
    "action_errors",
    "Action errors count",
    ["action"],
)


def measure_action(func):
    name = func.__name__
    func = metrics.wrap(action_time.labels(name).time())(func)
    func = metrics.wrap(action_errors.labels(name).count_exceptions())(func)
    return func


SESSION_TTL = timedelta(days=14)


def _update_ids_map(ids_map, ids):
    ids_map = ids_map.copy()
    ids_map.update(ids)
    return ids_map


class AccessError(Exception):
    pass


session_var = ContextVar("session")


@contextlib.asynccontextmanager
async def with_session(session):
    try:
        session_var.set(session)
        yield
    finally:
        session_var.set(None)


def auth_required(func):
    async def wrapper(*args, **kwargs):
        session = session_var.get()
        if not session.is_authenticated:
            raise AccessError("User is not authenticated")
        return await func(*args, **kwargs)

    return wrapper


class DirtyProjects:
    def __init__(self):
        self.by_flag = set()
        self.by_variable = set()


class Changes:
    _data: Dict[UUID, List[Action]]

    def __init__(self):
        self._data = defaultdict(list)

    def add(self, flag_id: UUID, action: Action):
        self._data[flag_id].append(action)

    def get_actions(self):
        return list(self._data.items())


@dataclass
class LocalId:
    scope: str
    value: str

    def __hash__(self):
        return hash((self.scope, self.value))


async def gen_id(local_id: LocalId, *, db: SAConnection):
    assert local_id.scope and local_id.value, local_id

    id_ = await sel_scalar(
        db,
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
        id_ = await sel_scalar(
            db,
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


async def get_auth_user(username, *, db):
    user_id_select = select([AuthUser.id]).where(AuthUser.username == username)
    user_id = await sel_scalar(db, user_id_select)
    if user_id is None:
        user_id = await sel_scalar(
            db,
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
            user_id = await sel_scalar(db, user_id_select)
            assert user_id is not None
    return user_id


@measure_action
async def sign_in(username: str, password: str, *, db, session, ldap) -> bool:
    assert username and password, "Username and password are required"
    if not await ldap.check_credentials(username, password):
        return False

    user_id = await get_auth_user(username, db=db)

    now = datetime.utcnow()
    exp = now + SESSION_TTL
    session_ident = session.ensure_ident()
    await db.execute(
        insert(AuthSession.__table__)
        .values(
            {
                AuthSession.session: session_ident,
                AuthSession.auth_user: user_id,
                AuthSession.creation_time: now,
                AuthSession.expiration_time: exp,
            }
        )
        .on_conflict_do_update(
            index_elements=[AuthSession.session],
            set_={
                AuthSession.auth_user.name: user_id,
                AuthSession.expiration_time.name: exp,
            },
        )
    )
    session.associate_user(user_id, exp)
    return True


@measure_action
async def sign_out(*, db, session):
    if session.ident:
        await db.execute(
            AuthSession.__table__.delete().where(
                AuthSession.session == session.ident
            )
        )
        session.disassociate_user()


@auth_required
@measure_action
async def enable_flag(flag_id, *, db, dirty, changes):
    assert flag_id, "Flag id is required"

    flag_id = UUID(hex=flag_id)
    await db.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: True})
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.ENABLE_FLAG)


@auth_required
@measure_action
async def disable_flag(flag_id, *, db, dirty, changes):
    assert flag_id, "Flag id is required"

    flag_id = UUID(hex=flag_id)
    await db.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: False})
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.DISABLE_FLAG)


@auth_required
@measure_action
async def reset_flag(flag_id, *, db, dirty, changes):
    assert flag_id, "Flag id is required"

    flag_id = UUID(hex=flag_id)
    await db.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: None})
    )
    await db.execute(
        Condition.__table__.delete().where(Condition.flag == flag_id)
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.RESET_FLAG)


@auth_required
@measure_action
async def delete_flag(flag_id, *, db, changes):
    assert flag_id, "Flag id is required"

    flag_id = UUID(hex=flag_id)
    await db.execute(
        Condition.__table__.delete().where(Condition.flag == flag_id)
    )
    await db.execute(Flag.__table__.delete().where(Flag.id == flag_id))

    changes.add(flag_id, Action.DELETE_FLAG)


@dataclass
class AddCheckOp:
    local_id: LocalId
    variable: str
    operator: int
    kind: str
    value_string: Optional[str]
    value_number: Optional[Union[int, float]]
    value_timestamp: Optional[str]
    value_set: Optional[list]

    def __init__(self, op: dict):
        self.local_id = LocalId(
            scope=op["local_id"]["scope"],
            value=op["local_id"]["value"],
        )
        self.variable = op["variable"]
        self.operator = int(op["operator"])
        self.kind = op["kind"]
        self.value_string = op.get("value_string")
        self.value_number = op.get("value_number")
        self.value_timestamp = op.get("value_timestamp")
        self.value_set = op.get("value_set")


@auth_required
@measure_action
async def add_check(op: AddCheckOp, *, db, dirty):
    id_ = await gen_id(op.local_id, db=db)
    variable_id = UUID(hex=op.variable)
    values = {
        Check.id: id_,
        Check.variable: variable_id,
        Check.operator: Operator(op.operator),
    }
    values.update(Check.value_from_op(op))
    await db.execute(
        insert(Check.__table__).values(values).on_conflict_do_nothing()
    )
    dirty.by_variable.add(variable_id)
    return {op.local_id: id_}


@dataclass
class AddConditionOp:
    @dataclass
    class Check:
        local_id: Optional[LocalId]
        id: Optional[str]

    flag_id: str
    local_id: LocalId
    checks: List[Check]

    def __init__(self, op: dict):
        self.local_id = LocalId(
            scope=op["local_id"]["scope"],
            value=op["local_id"]["value"],
        )
        self.flag_id = op["flag_id"]
        self.checks = [
            self.Check(
                local_id=LocalId(
                    scope=check["local_id"]["scope"],
                    value=check["local_id"]["value"],
                )
                if "local_id" in check
                else None,
                id=check.get("id"),
            )
            for check in op["checks"]
        ]


@auth_required
@measure_action
async def add_condition(op: AddConditionOp, *, db, ids, dirty, changes):
    id_ = await gen_id(op.local_id, db=db)

    flag_id = UUID(hex=op.flag_id)
    checks = [
        ids[check.local_id] if check.local_id else UUID(hex=check.id)
        for check in op.checks
    ]

    await db.execute(
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
    return _update_ids_map(ids, {op.local_id: id_})


@auth_required
@measure_action
async def disable_condition(condition_id, *, db, dirty, changes):
    assert condition_id, "Condition id is required"

    condition_id = UUID(hex=condition_id)
    flag_id = await sel_scalar(
        db,
        (
            Condition.__table__.delete()
            .where(Condition.id == condition_id)
            .returning(Condition.flag)
        ),
    )
    if flag_id is not None:
        dirty.by_flag.add(flag_id)
        changes.add(flag_id, Action.DISABLE_CONDITION)


async def postprocess(*, db, dirty):
    selections = []
    for flag_id in dirty.by_flag:
        selections.append(select([Flag.project]).where(Flag.id == flag_id))
    for variable_id in dirty.by_variable:
        selections.append(
            select([Variable.project]).where(Variable.id == variable_id)
        )
    if selections:
        await db.execute(
            update(Project.__table__)
            .where(or_(*[Project.id.in_(sel) for sel in selections]))
            .values({Project.version: Project.version + 1})
        )


async def update_changelog(*, session, db, changes: Changes):
    actions = changes.get_actions()
    if actions:
        assert session.user is not None
        for flag, flag_actions in actions:
            assert flag_actions, repr(flag_actions)
            await db.execute(
                insert(Changelog.__table__).values(
                    {
                        Changelog.timestamp: datetime.utcnow(),
                        Changelog.auth_user: session.user,
                        Changelog.flag: flag,
                        Changelog.actions: flag_actions,
                    }
                )
            )
