import alembic.config

from featureflags.config import config


def main(args: list[str]) -> None:
    alembic_cfg = alembic.config.Config()

    alembic_main_options = {
        "script_location": "featureflags:migrations",
        "url": config.postgres.dsn,
    }
    for name, value in alembic_main_options.items():
        alembic_cfg.set_main_option(name=name, value=value)

    alembic_cli = alembic.config.CommandLine()
    alembic_options = alembic_cli.parser.parse_args(args)

    alembic_cli.run_cmd(alembic_cfg, alembic_options)
