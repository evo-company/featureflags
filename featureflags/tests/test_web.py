import pytest
from hiku.endpoint.graphql import (
    AsyncBatchGraphQLEndpoint,
)
from sqlalchemy import select

from featureflags.graph import graph
from featureflags.graph.context import init_graph_context
from featureflags.models import Flag
from featureflags.services import auth
from featureflags.tests.state import mk_auth_user, mk_flag


async def check_flag(flag, conn):
    result = await conn.execute(select([Flag.enabled]).where(Flag.id == flag))
    return await result.scalar()


async def get_flag(flag, conn):
    result = await conn.execute(select([Flag.id]).where(Flag.id == flag))
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
