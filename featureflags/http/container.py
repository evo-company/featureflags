from dependency_injector import containers, providers
from hiku.engine import Engine
from hiku.executors.asyncio import AsyncIOExecutor

from featureflags.http.repositories.flags import FlagsRepository
from featureflags.services.db import init_db_engine


class Container(containers.DeclarativeContainer):
    """
    Container with http dependencies.
    """

    wiring_config = containers.WiringConfiguration(
        packages=[
            "featureflags.services",
            "featureflags.http",
        ]
    )

    graph_engine: Engine = providers.Factory(
        Engine,
        providers.Callable(AsyncIOExecutor),
    )
    db_engine = providers.Resource(init_db_engine)

    # Repos
    flags_repo = providers.Factory(
        FlagsRepository,
        db_engine=db_engine,
        graph_engine=graph_engine,
    )
