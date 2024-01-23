from alembic import context
from sqlalchemy import create_engine, pool

from featureflags.models import metadata

dsn = context.config.get_main_option("url")
assert dsn

engine = create_engine(dsn, poolclass=pool.NullPool)
with engine.connect() as connection:
    context.configure(connection=connection, target_metadata=metadata)
    with context.begin_transaction():
        context.run_migrations()
