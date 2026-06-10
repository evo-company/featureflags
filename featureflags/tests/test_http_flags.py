import pytest
from sqlalchemy import select

from featureflags.http.repositories.flags import FlagsRepository
from featureflags.http.types import PreloadFlagsRequest, SyncFlagsRequest
from featureflags.models import Flag, Project
from featureflags.tests.state import mk_flag, mk_project
from featureflags.utils import select_scalar


@pytest.fixture
def flags_repo(db_engine, graph_engine):
    return FlagsRepository(db_engine=db_engine, graph_engine=graph_engine)


@pytest.fixture
def readonly_flags_repo(db_engine, graph_engine):
    return FlagsRepository(
        db_engine=db_engine, graph_engine=graph_engine, readonly=True
    )


async def project_id_by_name(db_engine, name):
    async with db_engine.acquire() as conn:
        return await select_scalar(
            conn, select([Project.id]).where(Project.name == name)
        )


async def flag_id_by_name(db_engine, name):
    async with db_engine.acquire() as conn:
        return await select_scalar(
            conn, select([Flag.id]).where(Flag.name == name)
        )


@pytest.mark.asyncio
async def test_load_readonly_unknown_project(readonly_flags_repo, db_engine):
    request = PreloadFlagsRequest(
        project="unknown-project",
        version=0,
        flags=["NEW_FLAG"],
        values=[("NEW_VALUE", "default")],
    )

    response = await readonly_flags_repo.load(request)

    assert response.version == 0
    assert response.flags == []
    assert response.values == []
    assert await project_id_by_name(db_engine, "unknown-project") is None
    assert await flag_id_by_name(db_engine, "NEW_FLAG") is None


@pytest.mark.asyncio
async def test_load_readonly_existing_project(readonly_flags_repo, db_engine):
    project = await mk_project(db_engine, version=3)
    flag = await mk_flag(db_engine, project=project, enabled=True)

    request = PreloadFlagsRequest(
        project=project.name,
        version=0,
        flags=[flag.name, "NEW_FLAG"],
    )

    response = await readonly_flags_repo.load(request)

    assert response.version == 3
    assert [f.name for f in response.flags] == [flag.name]

    # the unknown flag was not registered
    assert await flag_id_by_name(db_engine, "NEW_FLAG") is None

    # the existing flag's report timestamp was not touched
    # (the column has an insert default, so compare with the initial value)
    async with db_engine.acquire() as conn:
        reported = await select_scalar(
            conn,
            select([Flag.reported_timestamp]).where(Flag.id == flag.id),
        )
    assert reported == flag.reported_timestamp


@pytest.mark.asyncio
async def test_load_registers_entities_when_not_readonly(
    flags_repo, db_engine
):
    request = PreloadFlagsRequest(
        project="new-project",
        version=0,
        flags=["NEW_FLAG"],
        values=[("NEW_VALUE", "default")],
    )

    response = await flags_repo.load(request)

    assert response.version == 0
    assert [f.name for f in response.flags] == ["NEW_FLAG"]
    assert await project_id_by_name(db_engine, "new-project") is not None
    assert await flag_id_by_name(db_engine, "NEW_FLAG") is not None


@pytest.mark.asyncio
@pytest.mark.parametrize("readonly", [True, False])
async def test_sync_unknown_project(db_engine, graph_engine, readonly):
    repo = FlagsRepository(
        db_engine=db_engine, graph_engine=graph_engine, readonly=readonly
    )

    response = await repo.sync(
        SyncFlagsRequest(project="unknown-project", version=5)
    )

    assert response.version == 0
    assert response.flags == []
    assert response.values == []


@pytest.mark.asyncio
async def test_sync_empty_diff_until_version_bump(
    readonly_flags_repo, db_engine
):
    project = await mk_project(db_engine, version=0)
    flag = await mk_flag(db_engine, project=project, enabled=True)

    # client is at the current version: empty diff, even though the flag
    # row exists (registered-but-unconfigured flags have no effect)
    response = await readonly_flags_repo.sync(
        SyncFlagsRequest(project=project.name, version=0)
    )
    assert response.version == 0
    assert response.flags == []

    # a UI edit on the master bumps the version (replicated here)
    async with db_engine.acquire() as conn:
        await conn.execute(
            Project.__table__.update()
            .where(Project.id == project.id)
            .values({Project.version: 1})
        )

    response = await readonly_flags_repo.sync(
        SyncFlagsRequest(project=project.name, version=0)
    )
    assert response.version == 1
    assert [f.name for f in response.flags] == [flag.name]
