import uuid
from collections.abc import AsyncGenerator
from typing import TYPE_CHECKING

import aiopg.sa
import pytest
import pytest_asyncio
from fastapi import FastAPI
from hiku.engine import Engine
from sqlalchemy import text

from featureflags.alembic import main as alembic_main
from featureflags.graph.types import Changes, DirtyProjects, ValuesChanges
from featureflags.models import metadata
from featureflags.services.auth import TestSession, user_session
from featureflags.services.ldap import BaseLDAP
from featureflags.web.app import create_app

if TYPE_CHECKING:
    from featureflags.web.container import Container


@pytest.fixture
def app() -> FastAPI:
    return create_app()


@pytest.fixture
async def container(app: FastAPI) -> AsyncGenerator["Container", None]:
    try:
        yield app.container  # type: ignore
    finally:
        await app.container.shutdown_resources()  # type: ignore


def migrate_up() -> None:
    alembic_main(["upgrade", "head"])


async def migrate_down(
    db_engine: aiopg.sa.Engine,
    skip_tables: list | None = None,
) -> None:
    skip_tables = skip_tables or []
    table_names = ", ".join(
        [
            f'"{table.name}"'
            for table in metadata.sorted_tables
            if table.name not in skip_tables
        ]
    )

    if table_names:
        async with db_engine.acquire() as connection:
            await connection.execute(
                text(f"TRUNCATE TABLE {table_names} RESTART IDENTITY CASCADE")
            )


@pytest_asyncio.fixture(autouse=True)
async def db_engine(
    container: "Container",
) -> AsyncGenerator[aiopg.sa.Engine, None]:
    engine = await container.db_engine()
    try:
        migrate_up()
        yield engine
    finally:
        await migrate_down(engine)


@pytest_asyncio.fixture
async def conn(
    db_engine: aiopg.sa.Engine,
) -> AsyncGenerator[aiopg.sa.SAConnection, None]:
    async with db_engine.acquire() as connection:
        yield connection


@pytest.fixture(autouse=True)
def test_session() -> TestSession:
    user_session.set(TestSession(user=uuid.uuid4()))  # type: ignore
    return user_session.get()  # type: ignore


@pytest.fixture
def dirty_projects() -> DirtyProjects:
    return DirtyProjects()


@pytest.fixture
def changes() -> Changes:
    return Changes()


@pytest.fixture
def values_changes() -> ValuesChanges:
    return ValuesChanges()


@pytest.fixture
def graph_engine(container: "Container") -> Engine:
    return container.graph_engine()


@pytest.fixture
def ldap(container: "Container") -> BaseLDAP:
    return container.ldap_service()
