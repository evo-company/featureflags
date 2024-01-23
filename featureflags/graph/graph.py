from uuid import UUID

import aiopg.sa
from hiku.engine import Engine, pass_context
from hiku.expr.core import (
    S,
    if_some,
)
from hiku.graph import (
    Field,
    Graph,
    Link,
    Node,
    Nothing,
    Option,
    Root,
    apply,
)
from hiku.query import Node as QueryNode
from hiku.result import Proxy, denormalize
from hiku.sources.aiopg import (
    FieldsQuery,
    LinkQuery,
)
from hiku.sources.graph import SubGraph
from hiku.telemetry.prometheus import AsyncGraphMetrics
from hiku.types import (
    Any,
    Boolean,
    Optional,
    Record,
    Sequence,
    String,
    TypeRef,
)
from sqlalchemy import select

from featureflags.graph import actions
from featureflags.graph.metrics import (
    GRAPH_PULL_ERRORS_COUNTER,
    GRAPH_PULL_TIME_HISTOGRAM,
)
from featureflags.graph.types import (
    AddCheckOp,
    AddConditionOp,
    AuthResult,
    DeleteFlagResult,
    GraphContext,
    Operation,
    ResetFlagResult,
    SaveFlagResult,
)
from featureflags.graph.utils import is_valid_uuid
from featureflags.metrics import wrap_metric
from featureflags.models import (
    AuthUser,
    Changelog,
    Check,
    Condition,
    Flag,
    Project,
    Variable,
)
from featureflags.services.auth import UserSession
from featureflags.utils import (
    exec_expression,
    exec_scalar,
)


async def id_field(fields: list, ids: list) -> list[list]:
    return [[i for _ in fields] for i in ids]


async def direct_link(ids: list) -> list:
    return ids


@pass_context
async def root_flag(ctx: dict, options: dict) -> list:
    if not (
        ctx[GraphContext.USER_SESSION].is_authenticated
        or not is_valid_uuid(options["id"])
    ):
        return Nothing

    flag = await exec_scalar(
        ctx[GraphContext.DB_ENGINE],
        select([Flag.id]).where(Flag.id == UUID(options["id"])),
    )

    return flag or Nothing


@pass_context
async def root_flags(ctx: dict, options: dict) -> list:
    if not ctx[GraphContext.USER_SESSION].is_authenticated:
        return []

    project_name = options.get("project_name")
    expr = select([Flag.id])

    if project_name is not None:
        expr = expr.where(
            Flag.project.in_(
                select([Project.id]).where(Project.name == project_name)
            )
        )

    return await exec_expression(ctx[GraphContext.DB_ENGINE], expr)


@pass_context
async def root_flags_by_ids(ctx: dict, options: dict) -> list:
    if not ctx[GraphContext.USER_SESSION].is_authenticated:
        return []

    ids = list(filter(is_valid_uuid, options["ids"]))
    if ids:
        return await exec_expression(
            ctx[GraphContext.DB_ENGINE],
            select([Flag.id]).where(Flag.id.in_(ids)),
        )

    return []


@pass_context
async def root_projects(ctx: dict) -> list:
    if not ctx[GraphContext.USER_SESSION].is_authenticated:
        return []

    return await exec_expression(
        ctx[GraphContext.DB_ENGINE], select([Project.id])
    )


@pass_context
async def root_changes(ctx: dict, options: dict) -> list:
    if not ctx[GraphContext.USER_SESSION].is_authenticated:
        return []

    project_ids = options.get("project_ids")
    sel = select([Changelog.id])
    if project_ids is not None:
        if not project_ids:
            return []
        join = Changelog.__table__.join(
            Flag.__table__, Changelog.flag == Flag.id
        )
        sel = sel.select_from(join).where(Flag.project.in_(project_ids))

    return await exec_expression(
        ctx[GraphContext.DB_ENGINE], sel.order_by(Changelog.timestamp.desc())
    )


@pass_context
async def root_authenticated(ctx: dict, _options: dict) -> list:
    return [ctx[GraphContext.USER_SESSION].is_authenticated]


async def check_variable(ids: list[int]) -> list[int]:
    return ids


async def flag_project(ids: list[int]) -> list[int]:
    return ids


ID_FIELD = Field("id", None, id_field)

flag_fq = FieldsQuery(GraphContext.DB_ENGINE, Flag.__table__)

_FlagNode = Node(
    "Flag",
    [
        ID_FIELD,
        Field("name", None, flag_fq),
        Field("project", None, flag_fq),
        Field("enabled", None, flag_fq),
    ],
)

condition_fq = FieldsQuery(GraphContext.DB_ENGINE, Condition.__table__)

_ConditionNode = Node(
    "Condition",
    [
        ID_FIELD,
        Field("checks", None, condition_fq),
    ],
)

check_fq = FieldsQuery(GraphContext.DB_ENGINE, Check.__table__)

_CheckNode = Node(
    "Check",
    [
        ID_FIELD,
        Field("operator", None, check_fq),
        Field("variable", None, check_fq),
        Field("value_string", None, check_fq),
        Field("value_number", None, check_fq),
        Field("value_timestamp", None, check_fq),
        Field("value_set", None, check_fq),
    ],
)

changelog_fq = FieldsQuery(GraphContext.DB_ENGINE, Changelog.__table__)

_ChangeNode = Node(
    "Change",
    [
        Field("timestamp", None, changelog_fq),
        Field("actions", None, changelog_fq),
        Field("auth_user", None, changelog_fq),
        Field("flag", None, changelog_fq),
    ],
)

_GRAPH = Graph(
    [
        _FlagNode,
        _ConditionNode,
        _CheckNode,
        _ChangeNode,
    ]
)
_GRAPH = apply(_GRAPH, [AsyncGraphMetrics("source")])

project_fq = FieldsQuery(GraphContext.DB_ENGINE, Project.__table__)

project_variables = LinkQuery(
    GraphContext.DB_ENGINE, from_column=Variable.project, to_column=Variable.id
)

ProjectNode = Node(
    "Project",
    [
        ID_FIELD,
        Field("name", None, project_fq),
        Field("version", None, project_fq),
        Link(
            "variables", Sequence["Variable"], project_variables, requires="id"
        ),
    ],
)

variable_fq = FieldsQuery(GraphContext.DB_ENGINE, Variable.__table__)

VariableNode = Node(
    "Variable",
    [
        ID_FIELD,
        Field("name", None, variable_fq),
        Field("type", None, variable_fq),
    ],
)

flag_sg = SubGraph(_GRAPH, "Flag")

flag_conditions = LinkQuery(
    GraphContext.DB_ENGINE,
    from_column=Condition.flag,
    to_column=Condition.id,
)

FlagNode = Node(
    "Flag",
    [
        ID_FIELD,
        Field("name", None, flag_sg),
        Field("_project", None, flag_sg.c(S.this.project)),
        Link("project", TypeRef["Project"], flag_project, requires="_project"),
        Field(
            "enabled",
            None,
            flag_sg.c(if_some([S.enabled, S.this.enabled], S.enabled, False)),
        ),
        Link(
            "conditions", Sequence["Condition"], flag_conditions, requires="id"
        ),
        Field(
            "overridden",
            None,
            flag_sg.c(if_some([S.enabled, S.this.enabled], True, False)),
        ),
    ],
)

condition_sg = SubGraph(_GRAPH, "Condition")

ConditionNode = Node(
    "Condition",
    [
        ID_FIELD,
        Field("_checks", None, condition_sg.c(S.this.checks)),
        Link("checks", Sequence["Check"], direct_link, requires="_checks"),
    ],
)

check_sg = SubGraph(_GRAPH, "Check")

CheckNode = Node(
    "Check",
    [
        ID_FIELD,
        Field("_variable", None, check_sg.c(S.this.variable)),
        Link(
            "variable",
            TypeRef["Variable"],
            check_variable,
            requires="_variable",
        ),
        Field("operator", None, check_sg),
        Field("value_string", None, check_sg),
        Field("value_number", None, check_sg),
        Field("value_timestamp", None, check_sg),
        Field("value_set", None, check_sg),
    ],
)

auth_user_fq = FieldsQuery(GraphContext.DB_ENGINE, AuthUser.__table__)

UserNode = Node(
    "User",
    [
        ID_FIELD,
        Field("username", None, auth_user_fq),
    ],
)

change_sg = SubGraph(_GRAPH, "Change")

ChangeNode = Node(
    "Change",
    [
        ID_FIELD,
        Field("timestamp", None, change_sg),
        Field("_user", None, change_sg.c(S.this.auth_user)),
        Field("_flag", None, change_sg.c(S.this.flag)),
        Field("actions", None, change_sg),
        Link("flag", TypeRef["Flag"], direct_link, requires="_flag"),
        Link("user", TypeRef["User"], direct_link, requires="_user"),
    ],
)

RootNode = Root(
    [
        Link(
            "flag",
            Optional["Flag"],
            root_flag,
            requires=None,
            options=[Option("id", String)],
        ),
        Link(
            "flags",
            Sequence["Flag"],
            root_flags,
            requires=None,
            options=[Option("project_name", Optional[String], default=None)],
        ),
        Link(
            "flags_by_ids",
            Sequence["Flag"],
            root_flags_by_ids,
            requires=None,
            options=[Option("ids", Sequence[String])],
        ),
        Link("projects", Sequence["Project"], root_projects, requires=None),
        Link(
            "changes",
            Sequence["Change"],
            root_changes,
            requires=None,
            options=[
                Option("project_ids", Optional[Sequence[String]], default=None)
            ],
        ),
        Field("authenticated", Boolean, root_authenticated),
    ]
)


async def auth_info(
    fields: list[Field], auth_results: list[AuthResult]
) -> list[list]:
    [auth_result] = auth_results

    def get_field(name: str) -> str | None:
        if name == "error":
            return auth_result.error

        raise ValueError(f"Unknown field: {name}")

    return [[get_field(f.name)] for f in fields]


SignInNode = Node(
    "SignIn",
    [
        Field("error", None, auth_info),
    ],
)

SignOutNode = Node(
    "SignOut",
    [
        Field("error", None, auth_info),
    ],
)


async def save_flag_info(
    fields: list[Field], results: list[SaveFlagResult]
) -> list[list]:
    [result] = results

    def get_field(name: str) -> list[str] | None:
        if name == "errors":
            return result.errors

        raise ValueError(f"Unknown field: {name}")

    return [[get_field(f.name)] for f in fields]


async def reset_flag_info(
    fields: list[Field], results: list[ResetFlagResult]
) -> list[list]:
    [result] = results

    def get_field(name: str) -> str | None:
        if name == "error":
            return result.error

        raise ValueError(f"Unknown field: {name}")

    return [[get_field(f.name)] for f in fields]


SaveFlagNode = Node(
    "SaveFlag",
    [
        Field("errors", None, save_flag_info),
    ],
)

ResetFlagNode = Node(
    "ResetFlag",
    [
        Field("error", None, reset_flag_info),
    ],
)


async def delete_flag_info(
    fields: list[Field], results: list[DeleteFlagResult]
) -> list[list]:
    [result] = results

    def get_field(name: str) -> str | None:
        if name == "error":
            return result.error

        raise ValueError(f"Unknown field: {name}")

    return [[get_field(f.name)] for f in fields]


DeleteFlagNode = Node(
    "DeleteFlag",
    [
        Field("error", None, delete_flag_info),
    ],
)

GRAPH = Graph(
    [
        ProjectNode,
        VariableNode,
        FlagNode,
        ConditionNode,
        CheckNode,
        UserNode,
        ChangeNode,
        RootNode,
    ]
)


@pass_context
async def sing_in(ctx: dict, options: dict) -> AuthResult:
    if ctx[GraphContext.USER_SESSION].is_authenticated:
        return AuthResult(None)

    username = options["username"]
    password = options["password"]

    if not username:
        return AuthResult("Username is required")
    if not password:
        return AuthResult("Password is required")

    async with ctx[GraphContext.DB_ENGINE].acquire() as conn:
        success = await actions.sign_in(
            username,
            password,
            conn=conn,
            session=ctx[GraphContext.USER_SESSION],
            ldap=ctx[GraphContext.LDAP_SERVICE],
        )

    error = "Invalid username or password" if not success else None
    return AuthResult(error)


@pass_context
async def sing_out(ctx: dict) -> AuthResult:
    if not ctx[GraphContext.USER_SESSION].is_authenticated:
        return AuthResult(None)
    async with ctx[GraphContext.DB_ENGINE].acquire() as conn:
        await actions.sign_out(
            conn=conn,
            session=ctx[GraphContext.USER_SESSION],
        )
    return AuthResult(None)


@pass_context
async def save_flag(ctx: dict, options: dict) -> SaveFlagResult:
    operations = options["operations"]

    if not operations:
        return SaveFlagResult(None)

    async with ctx[GraphContext.DB_ENGINE].acquire() as conn:
        for operation in operations:
            operation_payload = operation["payload"]
            operation_type = Operation(operation["type"])

            match operation_type:
                case Operation.ENABLE_FLAG:
                    await actions.enable_flag(
                        operation_payload["flag_id"],
                        conn=conn,
                        dirty=ctx[GraphContext.DIRTY_PROJECTS],
                        changes=ctx[GraphContext.CHANGES],
                    )
                case Operation.DISABLE_FLAG:
                    await actions.disable_flag(
                        operation_payload["flag_id"],
                        conn=conn,
                        dirty=ctx[GraphContext.DIRTY_PROJECTS],
                        changes=ctx[GraphContext.CHANGES],
                    )
                case Operation.ADD_CHECK:
                    new_ids = await actions.add_check(
                        AddCheckOp(operation_payload),
                        conn=conn,
                        dirty=ctx[GraphContext.DIRTY_PROJECTS],
                    )
                    if new_ids is not None:
                        ctx[GraphContext.CHECK_IDS].update(new_ids)
                case Operation.ADD_CONDITION:
                    new_ids = await actions.add_condition(
                        AddConditionOp(operation_payload),
                        conn=conn,
                        ids=ctx[GraphContext.CHECK_IDS],
                        dirty=ctx[GraphContext.DIRTY_PROJECTS],
                        changes=ctx[GraphContext.CHANGES],
                    )
                    if new_ids is not None:
                        ctx[GraphContext.CHECK_IDS].update(new_ids)
                case Operation.DISABLE_CONDITION:
                    await actions.disable_condition(
                        operation_payload["condition_id"],
                        conn=conn,
                        dirty=ctx[GraphContext.DIRTY_PROJECTS],
                        changes=ctx[GraphContext.CHANGES],
                    )
                case _:
                    raise ValueError(f"Unknown operation: {operation_type}")

        await actions.postprocess(
            conn=conn, dirty=ctx[GraphContext.DIRTY_PROJECTS]
        )
        await actions.update_changelog(
            session=ctx[GraphContext.USER_SESSION],
            conn=conn,
            changes=ctx[GraphContext.CHANGES],
        )

    return SaveFlagResult(None)


@pass_context
async def reset_flag(ctx: dict, options: dict) -> ResetFlagResult:
    async with ctx[GraphContext.DB_ENGINE].acquire() as conn:
        await actions.reset_flag(
            options["id"],
            conn=conn,
            dirty=ctx[GraphContext.DIRTY_PROJECTS],
            changes=ctx[GraphContext.CHANGES],
        )
        await actions.postprocess(
            conn=conn, dirty=ctx[GraphContext.DIRTY_PROJECTS]
        )
        await actions.update_changelog(
            session=ctx[GraphContext.USER_SESSION],
            conn=conn,
            changes=ctx[GraphContext.CHANGES],
        )

    return ResetFlagResult(None)


@pass_context
async def delete_flag(ctx: dict, options: dict) -> DeleteFlagResult:
    async with ctx[GraphContext.DB_ENGINE].acquire() as conn:
        await actions.delete_flag(
            options["id"],
            conn=conn,
            changes=ctx[GraphContext.CHANGES],
        )

    return DeleteFlagResult(None)


mutation_data_types = {
    "SaveFlagOperation": Record[{"type": String, "payload": Any}],
}

MUTATION_GRAPH = Graph(
    [
        *GRAPH.nodes,
        SignInNode,
        SignOutNode,
        SaveFlagNode,
        ResetFlagNode,
        DeleteFlagNode,
        Root(
            [
                Link(
                    "signIn",
                    TypeRef["SignIn"],
                    sing_in,
                    options=[
                        Option("username", String),
                        Option("password", String),
                    ],
                    requires=None,
                ),
                Link("signOut", TypeRef["SignOut"], sing_out, requires=None),
                Link(
                    "saveFlag",
                    TypeRef["SaveFlag"],
                    save_flag,
                    options=[
                        Option(
                            "operations", Sequence[TypeRef["SaveFlagOperation"]]
                        )
                    ],
                    requires=None,
                ),
                Link(
                    "resetFlag",
                    TypeRef["ResetFlag"],
                    reset_flag,
                    options=[Option("id", String)],
                    requires=None,
                ),
                Link(
                    "deleteFlag",
                    TypeRef["DeleteFlag"],
                    delete_flag,
                    options=[Option("id", String)],
                    requires=None,
                ),
            ]
        ),
    ],
    data_types=mutation_data_types,
)

GRAPH = apply(GRAPH, [AsyncGraphMetrics("public")])
MUTATION_GRAPH = apply(MUTATION_GRAPH, [AsyncGraphMetrics("mutation")])


@wrap_metric(GRAPH_PULL_TIME_HISTOGRAM.time())
@wrap_metric(GRAPH_PULL_ERRORS_COUNTER.count_exceptions())
async def exec_graph(
    graph_engine: Engine,
    query: QueryNode,
    db_engine: aiopg.sa.Engine,
    session: UserSession,
) -> Proxy:
    return await graph_engine.execute(  # type: ignore
        GRAPH,
        query,
        ctx={
            GraphContext.DB_ENGINE: db_engine,
            GraphContext.USER_SESSION: session,
        },
    )


async def exec_denormalize_graph(
    graph_engine: Engine,
    query: QueryNode,
    db_engine: aiopg.sa.Engine,
    session: UserSession,
) -> dict:
    result_proxy = await exec_graph(
        graph_engine=graph_engine,
        query=query,
        db_engine=db_engine,
        session=session,
    )
    return denormalize(GRAPH, result_proxy)
