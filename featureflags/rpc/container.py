from dependency_injector import containers, providers
from hiku.engine import Engine
from hiku.executors.asyncio import AsyncIOExecutor

from featureflags.services.db import init_db_engine


class Container(containers.DeclarativeContainer):
    """
    Container with rpc dependencies.
    """

    wiring_config = containers.WiringConfiguration(
        packages=[
            "featureflags.services",
            "featureflags.rpc",
        ]
    )

    graph_engine: Engine = providers.Factory(
        Engine,
        providers.Callable(AsyncIOExecutor),
    )
    db_engine = providers.Resource(init_db_engine)
