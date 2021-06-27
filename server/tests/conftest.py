import uuid

import pytest
import aiopg.sa
import sqlalchemy
import psycopg2.extensions

from hiku.engine import Engine
from hiku.executors.asyncio import AsyncIOExecutor

from featureflags.server.schema import metadata


@pytest.fixture(name='loop')
def loop_fixture(event_loop):
    return event_loop


@pytest.fixture(name='dsn', scope='session')
def dsn_fixture(request):
    name = 'test_{}'.format(uuid.uuid4().hex)
    pg_dsn = 'postgresql://postgres:postgres@postgres:5432/postgres'
    db_dsn = 'postgresql://postgres:postgres@postgres:5432/{}'.format(name)

    pg_engine = sqlalchemy.create_engine(pg_dsn)
    pg_engine.raw_connection()\
        .set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    pg_engine.execute('CREATE DATABASE {0}'.format(name))
    pg_engine.dispose()

    db_engine = sqlalchemy.create_engine(db_dsn)
    metadata.create_all(db_engine)
    db_engine.dispose()

    def fin():
        pg_engine = sqlalchemy.create_engine(pg_dsn)
        pg_engine.raw_connection() \
            .set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        pg_engine.execute('DROP DATABASE {0}'.format(name))
        pg_engine.dispose()

    request.addfinalizer(fin)
    return db_dsn


@pytest.fixture(name='sa')
def sa_fixture(loop, dsn):
    engine_ctx = aiopg.sa.create_engine(dsn, loop=loop, echo=True,
                                        enable_hstore=False)
    engine = loop.run_until_complete(engine_ctx.__aenter__())
    try:
        yield engine
    finally:
        loop.run_until_complete(engine_ctx.__aexit__(None, None, None))


@pytest.fixture(name='db')
def db_fixture(loop, sa):
    conn_ctx = sa.acquire()
    conn = loop.run_until_complete(conn_ctx.__aenter__())
    try:
        yield conn
    finally:
        loop.run_until_complete(conn_ctx.__aexit__(None, None, None))


@pytest.fixture(name='hiku_engine')
def hiku_engine_fixture(loop):
    return Engine(AsyncIOExecutor(loop=loop))
