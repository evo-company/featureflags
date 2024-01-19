import aiopg.sa
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Request
from fastapi.responses import ORJSONResponse
from hiku.endpoint.graphql import AsyncBatchGraphQLEndpoint

from featureflags.container import Container
from featureflags.graph import graph
from featureflags.graph.context import init_graph_context
from featureflags.services.auth import user_session
from featureflags.services.ldap import BaseLDAP

router = APIRouter(
    prefix="/graphql",
    tags=["graphql"],
)

graphql_endpoint = AsyncBatchGraphQLEndpoint(
    engine=Container.graph_engine(),
    query_graph=graph.GRAPH,
    mutation_graph=graph.MUTATION_GRAPH,
)


@router.post("")
@inject
async def graphql(
    request: Request,
    ldap_service: BaseLDAP = Depends(Provide[Container.ldap_service]),
    db_engine: aiopg.sa.Engine = Depends(Provide[Container.db_engine]),
) -> ORJSONResponse:
    query = await request.json()
    ctx = init_graph_context(
        session=user_session.get(),
        ldap=ldap_service,
        engine=db_engine,
    )
    result = await graphql_endpoint.dispatch(query, ctx)
    return ORJSONResponse(result)
