from collections.abc import AsyncGenerator

from dependency_injector import containers, providers
from hiku.endpoint.graphql import AsyncBatchGraphQLEndpoint
from hiku.engine import Engine
from hiku.executors.asyncio import AsyncIOExecutor

from featureflags.config import config
from featureflags.graph import graph
from featureflags.services.db import init_db_engine
from featureflags.services.ldap import LDAP, BaseLDAP, DummyLDAP
from featureflags.services.notifications import NotificationsService
from featureflags.services.oidc_auth import OidcAuthenticator


async def _init_notifications_service() -> (
    AsyncGenerator[NotificationsService, None]
):
    service = NotificationsService()
    yield service
    await service.close()


def _build_ldap_service() -> BaseLDAP | None:
    if config.test_environ:
        return DummyLDAP(user_is_bound=True)
    if config.ldap is None:
        return None
    return LDAP(host=config.ldap.host, base_dn=config.ldap.base_dn)


def _build_oidc_authenticators() -> dict[str, OidcAuthenticator]:
    if config.oidc is None:
        return {}
    return {
        provider.name: OidcAuthenticator(provider)
        for provider in config.oidc.providers
    }


class Container(containers.DeclarativeContainer):
    """
    Container with app dependencies.
    """

    wiring_config = containers.WiringConfiguration(
        packages=[
            "featureflags.services",
            "featureflags.web",
        ]
    )

    graph_engine: Engine = providers.Factory(
        Engine,
        providers.Callable(AsyncIOExecutor),
    )
    graphql_endpoint: AsyncBatchGraphQLEndpoint = providers.Singleton(
        AsyncBatchGraphQLEndpoint,
        engine=graph_engine,
        query_graph=graph.GRAPH,
        mutation_graph=graph.MUTATION_GRAPH,
    )

    db_engine = providers.Resource(init_db_engine)

    ldap_service = providers.Singleton(_build_ldap_service)

    oidc_authenticators = providers.Singleton(_build_oidc_authenticators)

    notifications_service = providers.Resource(_init_notifications_service)
