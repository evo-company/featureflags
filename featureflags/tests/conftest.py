import contextvars
import uuid
from typing import TYPE_CHECKING

import aiopg.sa
import pytest
import pytest_asyncio
from fastapi import FastAPI
from hiku.engine import Engine

from featureflags.graph.types import Changes, DirtyProjects
from featureflags.services.auth import TestSession
from featureflags.tests.state import mk_session_var
from featureflags.web.app import create_app

if TYPE_CHECKING:
    from featureflags.container import Container


@pytest.fixture
def app() -> FastAPI:
    return create_app()


@pytest.fixture
def container(app: FastAPI) -> "Container":
    return app.container  # type: ignore


@pytest_asyncio.fixture
async def db_engine(container: "Container") -> aiopg.sa.Engine:
    return await container.db_engine()


@pytest_asyncio.fixture
async def db_connection(db_engine: aiopg.sa.Engine) -> aiopg.sa.SAConnection:
    async with db_engine.acquire() as conn:
        yield conn


@pytest.fixture
def test_session() -> contextvars.ContextVar[TestSession]:
    return mk_session_var(TestSession(user=uuid.uuid4()))  # type: ignore


@pytest.fixture
def dirty_projects() -> DirtyProjects:
    return DirtyProjects()


@pytest.fixture
def changes() -> Changes:
    return Changes()


@pytest.fixture
def graph_engine(container: "Container") -> Engine:
    return container.graph_engine()


# @pytest.fixture(scope="session")
# def dsn(request):
#
#     pg_engine.raw_connection().set_isolation_level(
#         psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT
#
#
#     def fin():
#         pg_engine.raw_connection().set_isolation_level(
#             psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT
#
#

# @pytest_asyncio.fixture
# async def sa(dsn):
#         yield engine
#

# @pytest_asyncio.fixture
# async def db(sa):
#         yield conn
#
