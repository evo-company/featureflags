import pytest
from hiku.endpoint.graphql import AsyncBatchGraphQLEndpoint
from sqlalchemy import select

from featureflags.graph import graph
from featureflags.graph.context import init_graph_context
from featureflags.graph.types import Action, ValueAction
from featureflags.models import (
    Flag,
    NotificationChannel,
    ProjectNotificationChannel,
    Value,
)
from featureflags.services import auth
from featureflags.tests.state import (
    mk_auth_user,
    mk_flag,
    mk_notification_channel,
    mk_project,
    mk_value,
)
from featureflags.utils import select_first


async def check_flag(flag, conn):
    result = await conn.execute(select([Flag.enabled]).where(Flag.id == flag))
    return await result.scalar()


async def get_flag(flag, conn):
    result = await conn.execute(select([Flag.id]).where(Flag.id == flag))
    return await result.scalar()


async def check_value(value, conn):
    result = await conn.execute(
        select([Value.value_override]).where(Value.id == value)
    )
    return await result.scalar()


async def get_value(value, conn):
    result = await conn.execute(select([Value.id]).where(Value.id == value))
    return await result.scalar()


def make_graphql_endpoint(graph_engine):
    return AsyncBatchGraphQLEndpoint(
        engine=graph_engine,
        query_graph=graph.GRAPH,
        mutation_graph=graph.MUTATION_GRAPH,
    )


async def dispatch_as_user(graphql_endpoint, query, db_engine, ldap, user):
    ctx = init_graph_context(
        session=auth.TestSession(user.id),
        engine=db_engine,
        ldap=ldap,
    )
    return await graphql_endpoint.dispatch(query, ctx)


async def get_channel(channel_id, conn):
    result = await conn.execute(
        select([NotificationChannel.id]).where(
            NotificationChannel.id == channel_id
        )
    )
    return await result.scalar()


@pytest.mark.asyncio
@pytest.mark.parametrize("authenticated", [True, False])
async def test_reset_flag_graph(
    authenticated,
    db_engine,
    conn,
    graph_engine,
    ldap,
):
    flag = await mk_flag(db_engine, enabled=True)

    query = {
        "query": """
            mutation ResetFlag($id: String!) {
                resetFlag(id: $id) { error }
            }
        """,
        "variables": {"id": str(flag.id)},
    }
    graphql_endpoint = AsyncBatchGraphQLEndpoint(
        engine=graph_engine,
        query_graph=graph.GRAPH,
        mutation_graph=graph.MUTATION_GRAPH,
    )

    async def make_call(*, user=None):
        session = auth.TestSession(user=user)
        ctx = init_graph_context(
            session=session,
            engine=db_engine,
            ldap=ldap,
        )

        return await graphql_endpoint.dispatch(query, ctx)

    if authenticated:
        user = await mk_auth_user(db_engine)
        await make_call(user=user.id)
        assert await check_flag(flag.id, conn) is None
    else:
        with pytest.raises(AssertionError):
            await make_call(user=None)


@pytest.mark.asyncio
async def test_delete_flag_graph(
    db_engine,
    conn,
    graph_engine,
    ldap,
):
    flag = await mk_flag(db_engine, enabled=True)

    query = {
        "query": """
            mutation DeleteFlag($id: String!) {
                deleteFlag(id: $id) { error }
            }
        """,
        "variables": {"id": str(flag.id)},
    }
    user = await mk_auth_user(db_engine)

    graphql_endpoint = AsyncBatchGraphQLEndpoint(
        engine=graph_engine,
        query_graph=graph.GRAPH,
        mutation_graph=graph.MUTATION_GRAPH,
    )
    ctx = init_graph_context(
        session=auth.TestSession(user.id),
        engine=db_engine,
        ldap=ldap,
    )

    res = await graphql_endpoint.dispatch(query, ctx)
    assert res["data"]["deleteFlag"]["error"] is None

    assert await get_flag(flag.id, conn) is None


@pytest.mark.asyncio
@pytest.mark.parametrize("authenticated", [True, False])
async def test_reset_value_graph(
    authenticated,
    db_engine,
    conn,
    graph_engine,
    ldap,
):
    value_default = "reseted"
    value_override = "valued"

    value = await mk_value(
        db_engine,
        enabled=True,
        value_default=value_default,
        value_override=value_override,
    )

    query = {
        "query": """
            mutation ResetValue($id: String!) {
                resetValue(id: $id) { error }
            }
        """,
        "variables": {"id": str(value.id)},
    }
    graphql_endpoint = AsyncBatchGraphQLEndpoint(
        engine=graph_engine,
        query_graph=graph.GRAPH,
        mutation_graph=graph.MUTATION_GRAPH,
    )

    async def make_call(*, user=None):
        session = auth.TestSession(user=user)
        ctx = init_graph_context(
            session=session,
            engine=db_engine,
            ldap=ldap,
        )

        return await graphql_endpoint.dispatch(query, ctx)

    if authenticated:
        user = await mk_auth_user(db_engine)
        await make_call(user=user.id)
        assert await check_value(value.id, conn) == value_default
    else:
        with pytest.raises(AssertionError):
            await make_call(user=None)


@pytest.mark.asyncio
async def test_delete_value_graph(
    db_engine,
    conn,
    graph_engine,
    ldap,
):
    value_default = "enabled"
    value_override = "deleted"

    value = await mk_value(
        db_engine,
        enabled=True,
        value_default=value_default,
        value_override=value_override,
    )

    query = {
        "query": """
            mutation DeleteValue($id: String!) {
                deleteValue(id: $id) { error }
            }
        """,
        "variables": {"id": str(value.id)},
    }
    user = await mk_auth_user(db_engine)

    graphql_endpoint = AsyncBatchGraphQLEndpoint(
        engine=graph_engine,
        query_graph=graph.GRAPH,
        mutation_graph=graph.MUTATION_GRAPH,
    )
    ctx = init_graph_context(
        session=auth.TestSession(user.id),
        engine=db_engine,
        ldap=ldap,
    )

    res = await graphql_endpoint.dispatch(query, ctx)
    assert res["data"]["deleteValue"]["error"] is None

    assert await get_value(value.id, conn) is None


@pytest.mark.asyncio
async def test_save_notification_channel_graph(
    db_engine, conn, graph_engine, ldap
):
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation SaveChannel($name: String!, $webhook_url: String!) {
                saveNotificationChannel(
                    name: $name, webhook_url: $webhook_url
                ) { error }
            }
        """,
        "variables": {
            "name": "alerts",
            "webhook_url": "https://hooks.slack.com/services/T0/B0/x",
        },
    }

    res = await dispatch_as_user(
        make_graphql_endpoint(graph_engine), query, db_engine, ldap, user
    )

    assert res["data"]["saveNotificationChannel"]["error"] is None
    row = await select_first(
        conn,
        select([NotificationChannel.__table__]).where(
            NotificationChannel.name == "alerts"
        ),
    )
    assert row is not None


@pytest.mark.asyncio
async def test_save_notification_channel_invalid_url(
    db_engine, graph_engine, ldap
):
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation SaveChannel($name: String!, $webhook_url: String!) {
                saveNotificationChannel(
                    name: $name, webhook_url: $webhook_url
                ) { error }
            }
        """,
        "variables": {"name": "alerts", "webhook_url": "not-a-url"},
    }

    res = await dispatch_as_user(
        make_graphql_endpoint(graph_engine), query, db_engine, ldap, user
    )

    assert res["data"]["saveNotificationChannel"]["error"] == (
        "Webhook URL must be an http(s) URL"
    )


@pytest.mark.asyncio
async def test_save_notification_channel_duplicate_name(
    db_engine, graph_engine, ldap
):
    existing = await mk_notification_channel(db_engine)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation SaveChannel($name: String!, $webhook_url: String!) {
                saveNotificationChannel(
                    name: $name, webhook_url: $webhook_url
                ) { error }
            }
        """,
        "variables": {
            "name": existing.name,
            "webhook_url": "https://hooks.slack.com/services/T0/B0/x",
        },
    }

    res = await dispatch_as_user(
        make_graphql_endpoint(graph_engine), query, db_engine, ldap, user
    )

    error = res["data"]["saveNotificationChannel"]["error"]
    assert error == f'Channel "{existing.name}" already exists'


@pytest.mark.asyncio
async def test_delete_notification_channel_graph(
    db_engine, conn, graph_engine, ldap
):
    channel = await mk_notification_channel(db_engine)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation DeleteChannel($id: String!) {
                deleteNotificationChannel(id: $id) { error }
            }
        """,
        "variables": {"id": str(channel.id)},
    }

    res = await dispatch_as_user(
        make_graphql_endpoint(graph_engine), query, db_engine, ldap, user
    )

    assert res["data"]["deleteNotificationChannel"]["error"] is None
    assert await get_channel(channel.id, conn) is None


@pytest.mark.asyncio
async def test_set_project_notification_channels_graph(
    db_engine, conn, graph_engine, ldap
):
    project = await mk_project(db_engine)
    channel = await mk_notification_channel(db_engine)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation SetChannels(
                $project_id: String!, $channel_ids: [String!]!
            ) {
                setProjectNotificationChannels(
                    project_id: $project_id, channel_ids: $channel_ids
                ) { error }
            }
        """,
        "variables": {
            "project_id": str(project.id),
            "channel_ids": [str(channel.id)],
        },
    }

    res = await dispatch_as_user(
        make_graphql_endpoint(graph_engine), query, db_engine, ldap, user
    )

    assert res["data"]["setProjectNotificationChannels"]["error"] is None
    row = await select_first(
        conn,
        select([ProjectNotificationChannel.channel]).where(
            ProjectNotificationChannel.project == project.id
        ),
    )
    assert row.channel == channel.id


class FakeNotifications:
    def __init__(self):
        self.calls = []

    def dispatch_flag_changes(self, engine, session, changes):
        self.calls.append(("flag_changes", changes.get_actions()))

    def dispatch_value_changes(self, engine, session, changes):
        self.calls.append(("value_changes", changes.get_actions()))

    def dispatch_flag_deleted(self, engine, session, flag_name, project_id):
        self.calls.append(("flag_deleted", flag_name, project_id))

    def dispatch_value_deleted(self, engine, session, value_name, project_id):
        self.calls.append(("value_deleted", value_name, project_id))


async def dispatch_with_notifications(
    graph_engine, query, db_engine, ldap, user
):
    fake = FakeNotifications()
    ctx = init_graph_context(
        session=auth.TestSession(user.id),
        engine=db_engine,
        ldap=ldap,
        notifications=fake,
    )
    endpoint = make_graphql_endpoint(graph_engine)
    result = await endpoint.dispatch(query, ctx)
    return result, fake


@pytest.mark.asyncio
async def test_save_flag_dispatches_notifications(
    db_engine, graph_engine, ldap
):
    flag = await mk_flag(db_engine, enabled=False)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation SaveFlag($operations: [SaveFlagOperation!]!) {
                saveFlag(operations: $operations) { errors }
            }
        """,
        "variables": {
            "operations": [
                {
                    "type": "enable_flag",
                    "payload": {"flag_id": flag.id.hex},
                }
            ]
        },
    }

    result, fake = await dispatch_with_notifications(
        graph_engine, query, db_engine, ldap, user
    )

    assert result["data"]["saveFlag"]["errors"] is None
    assert fake.calls == [("flag_changes", [(flag.id, [Action.ENABLE_FLAG])])]


@pytest.mark.asyncio
async def test_reset_flag_dispatches_notifications(
    db_engine, graph_engine, ldap
):
    flag = await mk_flag(db_engine, enabled=True)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation ResetFlag($id: String!) {
                resetFlag(id: $id) { error }
            }
        """,
        "variables": {"id": str(flag.id)},
    }

    result, fake = await dispatch_with_notifications(
        graph_engine, query, db_engine, ldap, user
    )

    assert result["data"]["resetFlag"]["error"] is None
    assert fake.calls == [("flag_changes", [(flag.id, [Action.RESET_FLAG])])]


@pytest.mark.asyncio
async def test_delete_flag_dispatches_deleted(db_engine, graph_engine, ldap):
    project = await mk_project(db_engine)
    flag = await mk_flag(db_engine, enabled=True, project=project)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation DeleteFlag($id: String!) {
                deleteFlag(id: $id) { error }
            }
        """,
        "variables": {"id": str(flag.id)},
    }

    result, fake = await dispatch_with_notifications(
        graph_engine, query, db_engine, ldap, user
    )

    assert result["data"]["deleteFlag"]["error"] is None
    assert fake.calls == [("flag_deleted", flag.name, project.id)]


@pytest.mark.asyncio
async def test_save_value_dispatches_notifications(
    db_engine, graph_engine, ldap
):
    value = await mk_value(db_engine, enabled=False)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation SaveValue($operations: [SaveValueOperation!]!) {
                saveValue(operations: $operations) { errors }
            }
        """,
        "variables": {
            "operations": [
                {
                    "type": "enable_value",
                    "payload": {"value_id": value.id.hex},
                }
            ]
        },
    }

    result, fake = await dispatch_with_notifications(
        graph_engine, query, db_engine, ldap, user
    )

    assert result["data"]["saveValue"]["errors"] is None
    assert fake.calls == [
        ("value_changes", [(value.id, [ValueAction.ENABLE_VALUE])])
    ]


@pytest.mark.asyncio
async def test_reset_value_dispatches_notifications(
    db_engine, graph_engine, ldap
):
    value = await mk_value(db_engine, enabled=True)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation ResetValue($id: String!) {
                resetValue(id: $id) { error }
            }
        """,
        "variables": {"id": str(value.id)},
    }

    result, fake = await dispatch_with_notifications(
        graph_engine, query, db_engine, ldap, user
    )

    assert result["data"]["resetValue"]["error"] is None
    assert fake.calls == [
        ("value_changes", [(value.id, [ValueAction.RESET_VALUE])])
    ]


@pytest.mark.asyncio
async def test_delete_value_dispatches_deleted(db_engine, graph_engine, ldap):
    project = await mk_project(db_engine)
    value = await mk_value(db_engine, project=project)
    user = await mk_auth_user(db_engine)
    query = {
        "query": """
            mutation DeleteValue($id: String!) {
                deleteValue(id: $id) { error }
            }
        """,
        "variables": {"id": str(value.id)},
    }

    result, fake = await dispatch_with_notifications(
        graph_engine, query, db_engine, ldap, user
    )

    assert result["data"]["deleteValue"]["error"] is None
    assert fake.calls == [("value_deleted", value.name, project.id)]
