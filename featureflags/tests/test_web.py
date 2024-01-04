from dataclasses import dataclass
from uuid import UUID

import aiopg.sa
import hiku.engine
import pytest
from fastapi import HTTPException
from hiku.endpoint.graphql import (
    AsyncBatchGraphQLEndpoint,
    AsyncGraphQLEndpoint,
)
from sqlalchemy import select
from state import mk_auth_user, mk_flag

from featureflags.graph import graph
from featureflags.graph.context import init_graph_context
from featureflags.graph.graph import (
    GRAPH,
    MUTATION_GRAPH,
)
from featureflags.models import Flag
from featureflags.services import auth
from featureflags.services.auth import TestSession


@dataclass
class AppStub:
    sa_engine: aiopg.sa.Engine
    hiku_engine: hiku.engine.Engine
    ldap = None


@dataclass
class RequestStub:
    app: AppStub
    body: bytes
    user: UUID | None = None

    def __getitem__(self, item):
        if item == "session":
            return TestSession(self.user)
        else:
            raise KeyError(item)


async def check_flag(flag, *, db):
    result = await db.execute(select([Flag.enabled]).where(Flag.id == flag))
    return await result.scalar()


async def get_flag(flag, *, db):
    result = await db.execute(select([Flag.id]).where(Flag.id == flag))
    return await result.scalar()


@pytest.mark.asyncio
@pytest.mark.parametrize("authenticated", [True, False])
async def test_reset_flag_graph(authenticated, sa, db, graph_engine):
    flag = await mk_flag(db, enabled=True)

    query = {
        "query": """
            mutation ResetFlag($id: String!) {
                resetFlag(id: $id) { error }
            }
        """,
        "variables": {"id": str(flag.id)},
    }
    graphql_endpoint = AsyncGraphQLEndpoint(
        graph_engine,
        GRAPH,
        MUTATION_GRAPH,
    )

    async def make_call(*, user=None):
        session = auth.TestSession()
        if user:
            session = auth.TestSession(user)

        ctx = init_graph_context(
            session=session,
            engine=sa,
            ldap=None,
        )
        return await graphql_endpoint.dispatch_ext(query, ctx)

    if authenticated:
        await make_call(user=(await mk_auth_user(db)).id)
        assert await check_flag(flag.id, db=db) is None
    else:
        with pytest.raises(HTTPException):
            await make_call(user=None)


@pytest.mark.asyncio
async def test_delete_flag_graph(sa, db, graph_engine):
    flag = await mk_flag(db, enabled=True)

    query = {
        "query": """
            mutation DeleteFlag($id: String!) {
                deleteFlag(id: $id) { error }
            }
        """,
        "variables": {"id": str(flag.id)},
    }
    user = await mk_auth_user(db)

    graphql_endpoint = AsyncBatchGraphQLEndpoint(
        engine=graph_engine,
        graph=graph.GRAPH,
        mutation_graph=graph.MUTATION_GRAPH,
    )
    ctx = init_graph_context(
        session=auth.TestSession(user.id),
        engine=sa,
        ldap=None,
    )

    res = await graphql_endpoint.dispatch_ext(query, ctx)
    assert res["data"]["deleteFlag"]["error"] is None

    assert await get_flag(flag.id, db=db) is None
