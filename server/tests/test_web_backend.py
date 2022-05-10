from uuid import UUID
from typing import Optional
from dataclasses import dataclass

import pytest
import aiopg.sa
import hiku.engine

from sqlalchemy import select
from sanic.exceptions import Unauthorized

from featureflags.server.auth import TestSession
from featureflags.server.schema import Flag
from featureflags.server.graph.graph import (
    GRAPH,
    MUTATION_GRAPH,
)
from featureflags.server.web.backend import (
    AsyncGraphQLEndpoint,
    graph_context,
)

from featureflags.server import auth
from state import (
    mk_flag,
    mk_auth_user,
)


@dataclass
class AppStub:
    sa_engine: aiopg.sa.Engine
    hiku_engine: hiku.engine.Engine
    ldap = None


@dataclass
class RequestStub:
    app: AppStub
    body: bytes
    user: Optional[UUID] = None

    def __getitem__(self, item):
        if item == 'session':
            return TestSession(self.user)
        else:
            raise KeyError(item)


async def check_flag(flag, *, db):
    result = await db.execute(
        select([Flag.enabled]).where(Flag.id == flag)
    )
    return await result.scalar()


async def get_flag(flag, *, db):
    result = await db.execute(
        select([Flag.id]).where(Flag.id == flag)
    )
    return await result.scalar()


@pytest.mark.asyncio
@pytest.mark.parametrize('authenticated', [True, False])
async def test_reset_flag_graph(authenticated, sa, db, hiku_engine):
    flag = await mk_flag(db, enabled=True)

    query = {
        'query': """
            mutation ResetFlag($id: String!) { 
                resetFlag(id: $id) { error } 
            }
        """,
        'variables': {'id': str(flag.id)}
    }
    graphql_endpoint = AsyncGraphQLEndpoint(
        hiku_engine,
        GRAPH,
        MUTATION_GRAPH,
        ctx=None
    )

    async def make_call(*, user=None):
        session = auth.TestSession()
        if user:
            session = auth.TestSession(user)

        ctx = graph_context(
            sa,
            session,
            None,
        )
        graphql_endpoint.with_context(ctx)
        return await graphql_endpoint.dispatch_ext(query)

    if authenticated:
        await make_call(user=(await mk_auth_user(db)).id)
        assert await check_flag(flag.id, db=db) is None
    else:
        with pytest.raises(Unauthorized):
            await make_call(user=None)


@pytest.mark.asyncio
async def test_delete_flag_graph(sa, db, hiku_engine):
    flag = await mk_flag(db, enabled=True)

    query = {
        'query': """
            mutation DeleteFlag($id: String!) { 
                deleteFlag(id: $id) { error } 
            }
        """,
        'variables': {'id': str(flag.id)}
    }
    user = await mk_auth_user(db)

    graphql_endpoint = AsyncGraphQLEndpoint(
        hiku_engine,
        GRAPH,
        MUTATION_GRAPH,
        ctx=graph_context(
            sa,
            auth.TestSession(user.id),
            None,
        )
    )

    res = await graphql_endpoint.dispatch_ext(query)
    assert res['data']['deleteFlag']['error'] is None

    assert await get_flag(flag.id, db=db) is None
