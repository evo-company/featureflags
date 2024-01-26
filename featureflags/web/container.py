from typing import Literal

from dependency_injector import containers, providers
from hiku.endpoint.graphql import AsyncBatchGraphQLEndpoint
from hiku.engine import Engine
from hiku.executors.asyncio import AsyncIOExecutor

from featureflags.config import config
from featureflags.graph import graph
from featureflags.services.db import init_db_engine
from featureflags.services.ldap import LDAP, DummyLDAP


def select_main_or_testing_dependency() -> Literal["main", "testing"]:
    return "testing" if config.test_environ else "main"


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
    graphql_endpoint: AsyncBatchGraphQLEndpoint = providers.Factory(
        AsyncBatchGraphQLEndpoint,
        engine=graph_engine,
        query_graph=graph.GRAPH,
        mutation_graph=graph.MUTATION_GRAPH,
    )

    db_engine = providers.Resource(init_db_engine)

    ldap_service = providers.Selector(
        selector=select_main_or_testing_dependency,
        main=providers.Factory(
            LDAP,
            host=config.ldap.host,
            base_dn=config.ldap.base_dn,
        ),
        testing=providers.Factory(
            DummyLDAP,
            user_is_bound=True,
        ),
    )
