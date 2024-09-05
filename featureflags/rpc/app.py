import contextlib
import logging

import aiopg.sa
from dependency_injector.wiring import Provide, inject
from grpclib.health.service import Health
from grpclib.reflection.service import ServerReflection
from grpclib.server import Server
from grpclib.utils import graceful_exit
from hiku.engine import Engine

from featureflags.config import config
from featureflags.metrics import configure_metrics
from featureflags.rpc.container import Container
from featureflags.rpc.servicer import FeatureFlagsServicer
from featureflags.services.auth import set_internal_user_session

log = logging.getLogger(__name__)


@inject
async def create_server(
    db_engine: aiopg.sa.Engine = Provide[Container.db_engine],
    graph_engine: Engine = Provide[Container.graph_engine],
) -> Server:
    configure_metrics(port=config.instrumentation.prometheus_port)

    main_servicer = FeatureFlagsServicer(
        db_engine=db_engine,
        graph_engine=graph_engine,
    )
    health_servicer = Health()

    handlers = ServerReflection.extend([main_servicer, health_servicer])
    return Server(handlers)


async def main() -> None:
    async with contextlib.AsyncExitStack() as stack:
        container = Container()
        await container.init_resources()

        log.info("Using internal user session")
        set_internal_user_session()

        if config.sentry.enabled:
            from featureflags.sentry import SentryMode, configure_sentry

            configure_sentry(
                config.sentry, env_prefix="rpc", mode=SentryMode.GRPC
            )

        server = await create_server()
        stack.enter_context(graceful_exit([server]))  # type: ignore

        await server.start(
            host=config.rpc.host,
            port=config.rpc.port,
        )
        log.info(
            "gRPC server listening on %s:%s",
            config.rpc.host,
            config.rpc.port,
        )

        await server.wait_closed()
        await container.shutdown_resources()
        log.info("Exiting...")
