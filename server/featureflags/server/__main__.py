import logging

import click
import asyncio

from .config import load_config
from .logging import configure_logging

log = logging.getLogger(__name__)


@click.group()
@click.argument("config")
@click.pass_context
def cli(ctx, config):
    if not config:
        print("Please provide config path, e.g. config.yaml")
        ctx.exit(1)

    cfg = load_config(config)
    configure_logging(__package__, cfg.logging)
    ctx.obj = cfg


@cli.command(name="alembic")
@click.argument("args", nargs=-1)
@click.pass_obj
def alembic_command(cfg, args):
    import alembic.config

    alembic_cfg = alembic.config.Config()
    alembic_cfg.set_main_option(
        "script_location", "featureflags.server:migrations"
    )
    alembic_cfg.set_main_option("url", cfg.postgres.dsn)

    alembic_cli = alembic.config.CommandLine()
    options = alembic_cli.parser.parse_args(args)
    alembic_cli.run_cmd(alembic_cfg, options)


@cli.command(name="web")
@click.option("--host", default="0.0.0.0")
@click.option("--port", type=int)
@click.option("--prometheus-port", type=int)
@click.pass_obj
def web_command(cfg, host, port, prometheus_port):
    from .web.backend import main

    main(cfg, host, port, prometheus_port)


@cli.command(name="rpc")
@click.option("--host", default="0.0.0.0")
@click.option("--port", type=int)
@click.option("--prometheus-port", type=int)
@click.pass_obj
def rpc_command(cfg, host, port, prometheus_port):
    from .rpc.service import main

    asyncio.run(
        main(cfg, host=host, port=port, prometheus_port=prometheus_port),
        debug=True,
    )


if __name__ == "__main__":
    cli.main(prog_name=f"python -m {__package__}")
