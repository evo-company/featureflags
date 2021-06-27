import click
import asyncio
import strictconf.yaml

from .config import Config
from .logging import configure_logging


@click.group()
@click.argument('config')
@click.pass_context
def cli(ctx, config):
    cfg_path, _, cfg_section = config.partition('@')
    if not cfg_section:
        print('Please provide config section, e.g. config.yaml@section')
        ctx.exit(1)

    cfg = Config()
    strictconf.yaml.init(cfg, [cfg_path], cfg_section)
    configure_logging(__package__, cfg.dev)
    ctx.obj = cfg


@cli.command(name='alembic')
@click.argument('args', nargs=-1)
@click.pass_obj
def alembic_command(cfg, args):
    import alembic.config

    alembic_cfg = alembic.config.Config()
    alembic_cfg.set_main_option('script_location',
                                'featureflags.server:migrations')
    alembic_cfg.set_main_option('url', cfg.main.dsn)

    alembic_cli = alembic.config.CommandLine()
    options = alembic_cli.parser.parse_args(args)
    alembic_cli.run_cmd(alembic_cfg, options)


@cli.command(name='web')
@click.option('--host', default='0.0.0.0')
@click.option('--port', type=int)
@click.option('--prometheus-port', type=int)
@click.pass_obj
def web_command(cfg, host, port, prometheus_port):
    from .web.backend import main

    asyncio.run(main(cfg, host=host, port=port,
                     prometheus_port=prometheus_port))


@cli.command(name='rpc')
@click.option('--host', default='0.0.0.0')
@click.option('--port', type=int)
@click.option('--prometheus-port', type=int)
@click.pass_obj
def rpc_command(cfg, host, port, prometheus_port):
    from .rpc.service import main

    asyncio.run(main(cfg, host=host, port=port,
                     prometheus_port=prometheus_port),
                debug=True)


if __name__ == '__main__':
    cli.main(prog_name=f'python -m {__package__}')
