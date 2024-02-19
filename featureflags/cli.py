import logging
from typing import Annotated

import typer

from featureflags.logging import configure_logging

configure_logging(__package__)

log = logging.getLogger(__name__)
cli = typer.Typer()


@cli.command(
    name="alembic",
    help="Run alembic",
)
def alembic(args: Annotated[list[str], typer.Argument()]) -> None:
    from featureflags.alembic import main as alembic_main

    log.info("Executing command: `alembic`")
    alembic_main(args)


@cli.command(name="web", help="Run web server")
def web() -> None:
    from featureflags.web.app import main as web_main

    log.info("Executing command: `web`")
    web_main()


@cli.command(name="rpc", help="Run rpc server")
def rpc() -> None:
    import asyncio

    import uvloop

    from featureflags.rpc.app import main as rpc_main

    log.info("Executing command: `rpc`")
    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
    asyncio.run(rpc_main())


@cli.command(name="http", help="Run http server")
def http() -> None:
    from featureflags.http.app import main as http_main

    log.info("Executing command: `http`")
    http_main()
