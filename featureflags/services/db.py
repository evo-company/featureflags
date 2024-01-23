from collections.abc import AsyncGenerator

import aiopg.sa

from featureflags.config import config


async def init_db_engine() -> AsyncGenerator[aiopg.sa.Engine, None]:
    async with aiopg.sa.create_engine(
        dsn=config.postgres.dsn,
        echo=config.debug,
        enable_hstore=False,
        timeout=config.postgres.timeout,
    ) as engine:
        try:
            yield engine
        finally:
            engine.close()
            await engine.wait_closed()
