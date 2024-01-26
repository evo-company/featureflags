import aiopg.sa
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends
from fastapi.responses import ORJSONResponse
from hiku.endpoint.graphql import AsyncBatchGraphQLEndpoint

from featureflags.graph.context import init_graph_context
from featureflags.services.auth import user_session
from featureflags.services.ldap import BaseLDAP
from featureflags.web.container import Container
from featureflags.web.types import GraphQueryRequest

router = APIRouter(
    prefix="/graphql",
    tags=["graphql"],
)


@router.post("")
@inject
async def graphql(
    query: GraphQueryRequest,
    ldap_service: BaseLDAP = Depends(Provide[Container.ldap_service]),
    db_engine: aiopg.sa.Engine = Depends(Provide[Container.db_engine]),
    graphql_endpoint: AsyncBatchGraphQLEndpoint = Depends(
        Provide[Container.graphql_endpoint],
    ),
) -> ORJSONResponse:
    ctx = init_graph_context(
        session=user_session.get(),
        ldap=ldap_service,
        engine=db_engine,
    )
    result = await graphql_endpoint.dispatch(query.model_dump(), ctx)
    return ORJSONResponse(result)
