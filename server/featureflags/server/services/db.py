import aiopg.sa

from ..config import Config


def get_db(cfg: Config, *, timeout=10):
    return aiopg.sa.create_engine(
        cfg.postgres.dsn,
        echo=cfg.debug,
        enable_hstore=False,
        timeout=timeout,
    )
