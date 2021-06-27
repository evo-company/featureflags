import aiopg.sa

from ..config import Config


def get_db(cfg: Config, *, timeout=10):
    return aiopg.sa.create_engine(
        cfg.main.dsn, echo=cfg.main.debug,
        enable_hstore=False, timeout=timeout,
    )
