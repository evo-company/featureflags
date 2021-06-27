from uuid import uuid4, UUID
from typing import List, Dict
from datetime import datetime, timedelta
from itertools import chain
from collections import defaultdict

from aiopg.sa import SAConnection
from sqlalchemy import select, and_, update, or_
from prometheus_client import Histogram, Counter
from sqlalchemy.dialects.postgresql import insert

from featureflags.protobuf import backend_pb2

from . import metrics
from .utils import MC, requires, sel_scalar
from .schema import Operator, Project, Variable, AuthSession, AuthUser
from .schema import Flag, Check, LocalIdMap, Condition, Action, Changelog


action_time = Histogram(
    'action_time', 'Action latency (seconds)', ['action'],
    buckets=(0.010, 0.050, 0.100, 1.000, float('inf')),
)

action_errors = Counter(
    'action_errors', 'Action errors count', ['action'],
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


def auth_required(func):

    async def wrapper(*args, **kwargs):
        session = kwargs['session']
        if not session.is_authenticated:
            raise AccessError('User is not authenticated')
        kwargs = {k: v for k, v in kwargs.items() if k in func.__requires__}
        return await func(*args, **kwargs)

    wrapper.__requires__ = func.__requires__.union({'session'})
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


async def gen_id(local_id: backend_pb2.LocalId, *, db: SAConnection):
    assert local_id.scope and local_id.value, local_id

    id_ = await sel_scalar(db, (
        insert(LocalIdMap.__table__)
        .values({LocalIdMap.scope: local_id.scope,
                 LocalIdMap.value: local_id.value,
                 LocalIdMap.id: uuid4(),
                 LocalIdMap.timestamp: datetime.utcnow()})
        .on_conflict_do_nothing()
        .returning(LocalIdMap.id)
    ))
    if id_ is None:
        id_ = await sel_scalar(db, (
            select([LocalIdMap.id])
            .where(and_(LocalIdMap.scope == local_id.scope,
                        LocalIdMap.value == local_id.value))
        ))
    return id_


async def get_auth_user(username, *, db):
    user_id_select = (
        select([AuthUser.id])
        .where(AuthUser.username == username)
    )
    user_id = await sel_scalar(db, user_id_select)
    if user_id is None:
        user_id = await sel_scalar(db, (
            insert(AuthUser.__table__)
            .values({
                AuthUser.id: uuid4(),
                AuthUser.username: username,
            })
            .on_conflict_do_nothing()
            .returning(AuthUser.id)
        ))
        if user_id is None:
            user_id = await sel_scalar(db, user_id_select)
            assert user_id is not None
    return user_id


@requires
@measure_action
async def sign_in(op: backend_pb2.SignIn, *, db, session, ldap):
    assert op.username and op.password, op
    if not await ldap.check_credentials(op.username, op.password):
        return

    user_id = await get_auth_user(op.username, db=db)

    now = datetime.utcnow()
    exp = now + SESSION_TTL
    session_ident = session.ensure_ident()
    await db.execute(
        insert(AuthSession.__table__)
        .values({
            AuthSession.session: session_ident,
            AuthSession.auth_user: user_id,
            AuthSession.creation_time: now,
            AuthSession.expiration_time: exp,
        })
        .on_conflict_do_update(
            index_elements=[AuthSession.session],
            set_={
                AuthSession.auth_user.name: user_id,
                AuthSession.expiration_time.name: exp,
            },
        )
    )
    session.associate_user(user_id, exp)


@requires
@measure_action
async def sign_out(_: backend_pb2.SignOut, *, db, session):
    if session.ident:
        await db.execute(
            AuthSession.__table__.delete()
            .where(AuthSession.session == session.ident)
        )
        session.disassociate_user()


@requires
@measure_action
async def enable_flag(op: backend_pb2.EnableFlag, *, db, dirty, changes):
    assert op.flag_id, op

    flag_id = UUID(hex=op.flag_id.value)
    await db.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: True})
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.ENABLE_FLAG)


@requires
@measure_action
async def disable_flag(op: backend_pb2.DisableFlag, *, db, dirty, changes):
    assert op.flag_id, op

    flag_id = UUID(hex=op.flag_id.value)
    await db.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: False})
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.DISABLE_FLAG)


@requires
@measure_action
async def reset_flag(op: backend_pb2.ResetFlag, *, db, dirty, changes):
    assert op.flag_id, op

    flag_id = UUID(hex=op.flag_id.value)
    await db.execute(
        Flag.__table__.update()
        .where(Flag.id == flag_id)
        .values({Flag.enabled: None})
    )
    await db.execute(
        Condition.__table__.delete()
        .where(Condition.flag == flag_id)
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.RESET_FLAG)


@requires
@measure_action
async def add_check(op: backend_pb2.AddCheck, *, db, dirty):
    id_ = await gen_id(op.local_id, db=db)
    variable_id = UUID(hex=op.variable.value)
    values = {Check.id: id_,
              Check.variable: variable_id,
              Check.operator: Operator.from_pb(op.operator)}
    values.update(Check.value_from_pb(op))
    await db.execute(
        insert(Check.__table__)
        .values(values)
        .on_conflict_do_nothing()
    )
    dirty.by_variable.add(variable_id)
    return {(op.local_id.scope, op.local_id.value): id_}


@requires
@measure_action
async def add_condition(op: backend_pb2.AddCondition, *, db, ids, dirty,
                        changes):
    id_ = await gen_id(op.local_id, db=db)
    flag_id = UUID(hex=op.flag_id.value)
    checks = [
        ids[(i.local_id.scope, i.local_id.value)]
        if i.WhichOneof('kind') == 'local_id' else UUID(hex=i.id.value)
        for i in op.checks
    ]
    await db.execute(
        insert(Condition.__table__)
        .values({
            Condition.id: id_,
            Condition.flag: flag_id,
            Condition.checks: checks,
        })
        .on_conflict_do_nothing()
    )
    dirty.by_flag.add(flag_id)
    changes.add(flag_id, Action.ADD_CONDITION)
    return _update_ids_map(ids, {(op.local_id.scope, op.local_id.value): id_})


@requires
@measure_action
async def disable_condition(op: backend_pb2.DisableCondition, *, db, dirty,
                            changes):
    assert op.condition_id, op
    condition_id = UUID(hex=op.condition_id.value)
    flag_id = await sel_scalar(db, (
        Condition.__table__.delete()
        .where(Condition.id == condition_id)
        .returning(Condition.flag)
    ))
    if flag_id is not None:
        dirty.by_flag.add(flag_id)
        changes.add(flag_id, Action.DISABLE_CONDITION)


DISPATCH_TABLE = {
    backend_pb2.SignIn: sign_in,
    backend_pb2.SignOut: sign_out,
    backend_pb2.EnableFlag: auth_required(enable_flag),
    backend_pb2.DisableFlag: auth_required(disable_flag),
    backend_pb2.AddCheck: auth_required(add_check),
    backend_pb2.AddCondition: auth_required(add_condition),
    backend_pb2.DisableCondition: auth_required(disable_condition),
    backend_pb2.ResetFlag: auth_required(reset_flag),
}


@requires
async def postprocess(*, db, dirty):
    selections = []
    for flag_id in dirty.by_flag:
        selections.append(
            select([Flag.project])
            .where(Flag.id == flag_id)
        )
    for variable_id in dirty.by_variable:
        selections.append(
            select([Variable.project])
            .where(Variable.id == variable_id)
        )
    if selections:
        await db.execute(
            update(Project.__table__)
            .where(or_(*[Project.id.in_(sel) for sel in selections]))
            .values({Project.version: Project.version + 1})
        )


@requires
async def update_changelog(*, session, db, changes: Changes):
    actions = changes.get_actions()
    if actions:
        assert session.user is not None
        for flag, flag_actions in actions:
            assert flag_actions, repr(flag_actions)
            await db.execute(
                insert(Changelog.__table__)
                .values({
                    Changelog.timestamp: datetime.utcnow(),
                    Changelog.auth_user: session.user,
                    Changelog.flag: flag,
                    Changelog.actions: flag_actions,
                })
            )


class DummyCtx:

    def __aenter__(self):
        pass

    def __aexit__(self, exc_type, exc_val, exc_tb):
        pass


async def dispatch_ops(operations: List[backend_pb2.Operation], *,
                       sa, session, ldap):
    ops = [getattr(op, op.WhichOneof('op')) for op in operations]
    fns = [DISPATCH_TABLE[type(action)] for action in ops]

    reqs = set(chain(
        postprocess.__requires__,
        update_changelog.__requires__,
        *[f.__requires__ for f in fns]
    ))

    ids = {}
    reqs_map = {
        'dirty': DirtyProjects(),
        'session': session,
        'ldap': ldap,
    }
    if 'mc' in reqs:
        reqs_map['mc'] = MC()
    if 'ids' in reqs:
        reqs_map['ids'] = ids
    if 'changes' in reqs:
        reqs_map['changes'] = Changes()

    db_ctx = sa.acquire() if 'db' in reqs else DummyCtx()
    async with db_ctx as db:
        reqs_map['db'] = db
        for op, fn in zip(ops, fns):
            new_ids = await fn(op, **{k: reqs_map[k] for k in fn.__requires__})
            if new_ids is not None:
                ids.update(new_ids)
        await postprocess(**{k: reqs_map[k]
                             for k in postprocess.__requires__})
        await update_changelog(**{k: reqs_map[k]
                                  for k in update_changelog.__requires__})
