import re
from collections import namedtuple

from uuid import UUID

from sqlalchemy import select
from prometheus_client import (
    Histogram,
    Counter,
)

from hiku.graph import (
    Graph,
    Root,
    Link,
    Option,
    Node,
    Field,
    Nothing,
    apply,
)
from hiku.types import (
    TypeRef,
    String,
    Sequence,
    Optional,
    Boolean,
    Record,
    Any,
)
from hiku.engine import pass_context
from hiku.expr.core import (
    S,
    if_some,
)
from hiku.sources.graph import SubGraph
from hiku.sources.aiopg import (
    FieldsQuery,
    LinkQuery,
)
from hiku.telemetry.prometheus import AsyncGraphMetrics

from .. import metrics
from .. import actions
from ..actions import (
    AddCheckOp,
    AddConditionOp,
    postprocess,
    update_changelog,
)
from ..utils import (
    exec_expr,
    exec_scalar,
)
from ..schema import (
    Project,
    Variable,
    Flag,
    Condition,
    Check,
    Changelog,
)
from ..schema import AuthUser

graph_pull_time = Histogram(
    'graph_pull_time', 'Graph pull time (seconds)', [],
    buckets=(0.050, 0.100, 0.250, 1, float('inf')),
)

graph_pull_errors = Counter(
    'graph_pull_errors', 'Graph pull errors count', [],
)

SA_ENGINE = 'sa-engine'
SESSION = 'session'
LDAP = 'ldap'
DIRTY = 'dirty'
CHANGES = 'changes'
IDS = 'ids'

_UUID_RE = re.compile(
    '^'
    '[0-9a-f]{8}-?'
    '[0-9a-f]{4}-?'
    '[0-9a-f]{4}-?'
    '[0-9a-f]{4}-?'
    '[0-9a-f]{12}'
    '$'
)


def _is_uuid(value):
    return _UUID_RE.match(value) is not None


async def id_field(fields, ids):
    return [[i for _ in fields] for i in ids]


async def direct_link(ids):
    return ids


@pass_context
async def root_flag(ctx, options):
    if not ctx[SESSION].is_authenticated:
        return Nothing
    if not _is_uuid(options['id']):
        return Nothing
    sel = select([Flag.id]).where(Flag.id == UUID(hex=options['id']))
    return await exec_scalar(ctx[SA_ENGINE], sel) or Nothing


@pass_context
async def root_flags(ctx, options):
    if not ctx[SESSION].is_authenticated:
        return []
    project_name = options.get('project_name')
    expr = select([Flag.id])
    if project_name is not None:
        expr = expr.where(Flag.project.in_(
            select([Project.id])
            .where(Project.name == options['project_name'])
        ))
    return await exec_expr(ctx[SA_ENGINE], expr)


@pass_context
async def root_flags_by_ids(ctx, options):
    if not ctx[SESSION].is_authenticated:
        return []
    ids = list(filter(_is_uuid, options['ids']))
    if len(ids) == 0:
        return []
    else:
        return await exec_expr(ctx[SA_ENGINE],
                               select([Flag.id]).where(Flag.id.in_(ids)))


@pass_context
async def root_projects(ctx):
    if not ctx[SESSION].is_authenticated:
        return []
    else:
        return await exec_expr(ctx[SA_ENGINE],
                               select([Project.id]))


@pass_context
async def root_changes(ctx, options):
    if not ctx[SESSION].is_authenticated:
        return []
    project_ids = options.get('project_ids')
    sel = select([Changelog.id])
    if project_ids is not None:
        if not project_ids:
            return []
        join = Changelog.__table__.join(Flag.__table__,
                                        Changelog.flag == Flag.id)
        sel = (
            sel.select_from(join)
            .where(Flag.project.in_(project_ids))
        )
    return await exec_expr(ctx[SA_ENGINE],
                           sel.order_by(Changelog.timestamp.desc()))


@pass_context
async def root_authenticated(ctx, _):
    return [ctx[SESSION].is_authenticated]


async def check_variable(ids):
    return ids


async def flag_project(ids):
    return ids


ID_FIELD = Field('id', None, id_field)

flag_fq = FieldsQuery(SA_ENGINE, Flag.__table__)

_FlagNode = Node('Flag', [
    ID_FIELD,
    Field('name', None, flag_fq),
    Field('project', None, flag_fq),
    Field('enabled', None, flag_fq),
])

condition_fq = FieldsQuery(SA_ENGINE, Condition.__table__)

_ConditionNode = Node('Condition', [
    ID_FIELD,
    Field('checks', None, condition_fq),
])

check_fq = FieldsQuery(SA_ENGINE, Check.__table__)

_CheckNode = Node('Check', [
    ID_FIELD,
    Field('operator', None, check_fq),
    Field('variable', None, check_fq),
    Field('value_string', None, check_fq),
    Field('value_number', None, check_fq),
    Field('value_timestamp', None, check_fq),
    Field('value_set', None, check_fq),
])

changelog_fq = FieldsQuery(SA_ENGINE, Changelog.__table__)

_ChangeNode = Node('Change', [
    Field('timestamp', None, changelog_fq),
    Field('actions', None, changelog_fq),
    Field('auth_user', None, changelog_fq),
    Field('flag', None, changelog_fq),
])

_GRAPH = Graph([
    _FlagNode,
    _ConditionNode,
    _CheckNode,
    _ChangeNode,
])
_GRAPH = apply(_GRAPH, [AsyncGraphMetrics('source')])

project_fq = FieldsQuery(SA_ENGINE, Project.__table__)

project_variables = LinkQuery(SA_ENGINE, from_column=Variable.project,
                              to_column=Variable.id)

ProjectNode = Node('Project', [
    ID_FIELD,
    Field('name', None, project_fq),
    Field('version', None, project_fq),
    Link('variables', Sequence['Variable'], project_variables, requires='id'),
])

variable_fq = FieldsQuery(SA_ENGINE, Variable.__table__)

VariableNode = Node('Variable', [
    ID_FIELD,
    Field('name', None, variable_fq),
    Field('type', None, variable_fq),
])

flag_sg = SubGraph(_GRAPH, 'Flag')

flag_conditions = LinkQuery(SA_ENGINE, from_column=Condition.flag,
                            to_column=Condition.id)

FlagNode = Node('Flag', [
    ID_FIELD,
    Field('name', None, flag_sg),
    Field('_project', None, flag_sg.c(S.this.project)),
    Link('project', TypeRef['Project'], flag_project, requires='_project'),
    Field('enabled', None, flag_sg.c(
        if_some([S.enabled, S.this.enabled], S.enabled, False)
    )),
    Link('conditions', Sequence['Condition'], flag_conditions, requires='id'),
    Field('overridden', None, flag_sg.c(
        if_some([S.enabled, S.this.enabled], True, False)
    )),
])

condition_sg = SubGraph(_GRAPH, 'Condition')

ConditionNode = Node('Condition', [
    ID_FIELD,
    Field('_checks', None, condition_sg.c(S.this.checks)),
    Link('checks', Sequence['Check'], direct_link, requires='_checks')
])

check_sg = SubGraph(_GRAPH, 'Check')

CheckNode = Node('Check', [
    ID_FIELD,
    Field('_variable', None, check_sg.c(S.this.variable)),
    Link('variable', TypeRef['Variable'], check_variable, requires='_variable'),
    Field('operator', None, check_sg),
    Field('value_string', None, check_sg),
    Field('value_number', None, check_sg),
    Field('value_timestamp', None, check_sg),
    Field('value_set', None, check_sg),
])

auth_user_fq = FieldsQuery(SA_ENGINE, AuthUser.__table__)

UserNode = Node('User', [
    ID_FIELD,
    Field('username', None, auth_user_fq),
])

change_sg = SubGraph(_GRAPH, 'Change')

ChangeNode = Node('Change', [
    ID_FIELD,
    Field('timestamp', None, change_sg),
    Field('_user', None, change_sg.c(S.this.auth_user)),
    Field('_flag', None, change_sg.c(S.this.flag)),
    Field('actions', None, change_sg),
    Link('flag', TypeRef['Flag'], direct_link, requires='_flag'),
    Link('user', TypeRef['User'], direct_link, requires='_user'),
])

RootNode = Root([
    Link('flag', Optional['Flag'], root_flag,
         requires=None, options=[Option('id', String)]),
    Link('flags', Sequence['Flag'], root_flags,
         requires=None, options=[Option('project_name', Optional[String],
                                        default=None)]),
    Link('flags_by_ids', Sequence['Flag'], root_flags_by_ids,
         requires=None, options=[Option('ids', Sequence[String])]),
    Link('projects', Sequence['Project'], root_projects, requires=None),
    Link('changes', Sequence['Change'], root_changes,
         requires=None,
         options=[Option('project_ids', Optional[Sequence[String]],
                         default=None)]),
    Field('authenticated', Boolean, root_authenticated),
])


async def auth_info(fields, auth_results):
    [auth_result] = auth_results

    def get_field(name):
        if name == 'error':
            return auth_result.error

        raise ValueError(f'Unknown field: {name}')

    return [[get_field(f.name)] for f in fields]


SignInNode = Node('SignIn', [
    Field('error', None, auth_info),
])

SignOutNode = Node('SignOut', [
    Field('error', None, auth_info),
])


async def save_flag_info(fields, results):
    [result] = results

    def get_field(name):
        if name == 'errors':
            return result.errors

        raise ValueError(f'Unknown field: {name}')

    return [[get_field(f.name)] for f in fields]


async def reset_flag_info(fields, results):
    [result] = results

    def get_field(name):
        if name == 'error':
            return result.error

        raise ValueError(f'Unknown field: {name}')

    return [[get_field(f.name)] for f in fields]


SaveFlagNode = Node('SaveFlag', [
    Field('errors', None, save_flag_info),
])

ResetFlagNode = Node('ResetFlag', [
    Field('error', None, reset_flag_info),
])


async def delete_flag_info(fields, results):
    [result] = results

    def get_field(name):
        if name == 'error':
            return result.error

        raise ValueError(f'Unknown field: {name}')

    return [[get_field(f.name)] for f in fields]


DeleteFlagNode = Node('DeleteFlag', [
    Field('error', None, delete_flag_info),
])

GRAPH = Graph([
    ProjectNode,
    VariableNode,
    FlagNode,
    ConditionNode,
    CheckNode,
    UserNode,
    ChangeNode,
    RootNode,
])

AuthResult = namedtuple('AuthResult', ['error'])


@pass_context
async def sing_in(ctx, options):
    if ctx[SESSION].is_authenticated:
        return AuthResult(None)

    username = options['username']
    password = options['password']

    if not username:
        return AuthResult('Username is required')
    if not password:
        return AuthResult('Password is required')

    async with ctx[SA_ENGINE].acquire() as conn:
        await actions.sign_in(
            username,
            password,
            db=conn,
            session=ctx[SESSION],
            ldap=ctx[LDAP],
        )
    return AuthResult(None)


@pass_context
async def sing_out(ctx):
    if not ctx[SESSION].is_authenticated:
        return AuthResult(None)
    async with ctx[SA_ENGINE].acquire() as conn:
        await actions.sign_out(
            db=conn,
            session=ctx[SESSION],
        )
    return AuthResult(None)


SaveFlagResult = namedtuple('SaveFlagResult', ['errors'])


class Operation:
    disable_flag = 'disable_flag'
    enable_flag = 'enable_flag'
    add_check = 'add_check'
    add_condition = 'add_condition'
    disable_condition = 'disable_condition'


@pass_context
async def save_flag(ctx, options):
    operations = options['operations']

    if not operations:
        return SaveFlagResult(None)

    async with ctx[SA_ENGINE].acquire() as conn, \
            actions.with_session(ctx[SESSION]):
        for op in operations:
            payload = op['payload']
            type_ = op['type']

            if type_ == Operation.enable_flag:
                await actions.enable_flag(
                    payload['flag_id'],
                    db=conn,
                    dirty=ctx[DIRTY],
                    changes=ctx[CHANGES],
                )
            elif type_ == Operation.disable_flag:
                await actions.disable_flag(
                    payload['flag_id'],
                    db=conn,
                    dirty=ctx[DIRTY],
                    changes=ctx[CHANGES],
                )
            elif type_ == Operation.add_check:
                new_ids = await actions.add_check(
                    AddCheckOp(payload),
                    db=conn,
                    dirty=ctx[DIRTY],
                )
                if new_ids is not None:
                    ctx[IDS].update(new_ids)
            elif type_ == Operation.add_condition:
                new_ids = await actions.add_condition(
                    AddConditionOp(payload),
                    db=conn,
                    ids=ctx[IDS],
                    dirty=ctx[DIRTY],
                    changes=ctx[CHANGES],
                )
                if new_ids is not None:
                    ctx[IDS].update(new_ids)
            elif type_ == Operation.disable_condition:
                await actions.disable_condition(
                    payload['condition_id'],
                    db=conn,
                    dirty=ctx[DIRTY],
                    changes=ctx[CHANGES],
                )
            else:
                raise ValueError(f'Unknown operation: {type_}')

        await postprocess(db=conn, dirty=ctx[DIRTY])
        await update_changelog(
            session=ctx[SESSION],
            db=conn,
            changes=ctx[CHANGES]
        )

    return SaveFlagResult(None)


ResetFlagResult = namedtuple('ResetFlagResult', ['error'])


@pass_context
async def reset_flag(ctx, options):
    async with ctx[SA_ENGINE].acquire() as conn, \
            actions.with_session(ctx[SESSION]):
        await actions.reset_flag(
            options['id'],
            db=conn,
            dirty=ctx[DIRTY],
            changes=ctx[CHANGES],
        )
        await postprocess(db=conn, dirty=ctx[DIRTY])
        await update_changelog(
            session=ctx[SESSION],
            db=conn,
            changes=ctx[CHANGES]
        )

    return ResetFlagResult(None)


DeleteFlagResult = namedtuple('DeleteFlagResult', ['error'])


@pass_context
async def delete_flag(ctx, options):
    async with ctx[SA_ENGINE].acquire() as conn, \
            actions.with_session(ctx[SESSION]):
        await actions.delete_flag(
            options['id'],
            db=conn,
            changes=ctx[CHANGES],
        )

    return DeleteFlagResult(None)


mutation_data_types = {
    'SaveFlagOperation': Record[{
        'type': String,
        'payload': Any
    }],
}

MUTATION_GRAPH = Graph(GRAPH.nodes + [
    SignInNode,
    SignOutNode,
    SaveFlagNode,
    ResetFlagNode,
    DeleteFlagNode,
    Root([
        Link(
            'signIn',
            TypeRef['SignIn'],
            sing_in,
            options=[
                Option('username', String),
                Option('password', String),
            ], requires=None,
        ),
        Link(
            'signOut',
            TypeRef['SignOut'],
            sing_out,
            requires=None
        ),
        Link(
            'saveFlag',
            TypeRef['SaveFlag'],
            save_flag,
            options=[
                Option('operations', Sequence[TypeRef['SaveFlagOperation']]),
            ], requires=None,
        ),
        Link(
            'resetFlag',
            TypeRef['ResetFlag'],
            reset_flag,
            options=[
                Option('id', String),
            ], requires=None,
        ),
        Link(
            'deleteFlag',
            TypeRef['DeleteFlag'],
            delete_flag,
            options=[
                Option('id', String),
            ], requires=None,
        ),
    ])
], data_types=mutation_data_types)

GRAPH = apply(GRAPH, [AsyncGraphMetrics('public')])
MUTATION_GRAPH = apply(MUTATION_GRAPH, [AsyncGraphMetrics('mutation')])


@metrics.wrap(graph_pull_time.time())
@metrics.wrap(graph_pull_errors.count_exceptions())
async def pull(engine, query, *, sa, session):
    return await engine.execute(GRAPH, query, ctx={
        SA_ENGINE: sa,
        SESSION: session,
    })
