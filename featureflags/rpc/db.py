"""
    This module defines client -> server feedback, which is used to
    notify server about new projects/variables/flags
"""
from uuid import UUID, uuid4

from aiopg.sa import SAConnection
from sqlalchemy import and_, select
from sqlalchemy.dialects.postgresql import insert

from featureflags.models import Flag, Project, Variable, VariableType
from featureflags.protobuf import service_pb2
from featureflags.utils import EntityCache, FlagAggStats


async def _select_project(name: str, *, conn: SAConnection) -> UUID:
    result = await conn.execute(
        select([Project.id]).where(Project.name == name)
    )
    return await result.scalar()


async def _insert_project(name: str, *, conn: SAConnection) -> UUID:
    result = await conn.execute(
        insert(Project.__table__)
        .values({Project.id: uuid4(), Project.name: name, Project.version: 0})
        .on_conflict_do_nothing()
        .returning(Project.id)
    )
    return await result.scalar()


async def _get_or_create_project(
    name: str,
    *,
    conn: SAConnection,
    entity_cache: EntityCache,
) -> UUID:
    assert name
    id_ = entity_cache.project.get(name)
    if id_ is None:  # not in cache
        id_ = await _select_project(name, conn=conn)
        if id_ is None:  # not in db
            id_ = await _insert_project(name, conn=conn)
            if id_ is None:  # conflicting insert
                id_ = await _select_project(name, conn=conn)
                assert id_ is not None  # must be in db
        entity_cache.project[name] = id_
    return id_


async def _select_variable(
    project: UUID, name: str, *, conn: SAConnection
) -> UUID:
    result = await conn.execute(
        select([Variable.id]).where(
            and_(Variable.project == project, Variable.name == name)
        )
    )
    return await result.scalar()


async def _insert_variable(
    project: UUID,
    name: str,
    type_: VariableType,
    *,
    conn: SAConnection,
) -> UUID:
    result = await conn.execute(
        insert(Variable.__table__)
        .values(
            {
                Variable.id: uuid4(),
                Variable.project: project,
                Variable.name: name,
                Variable.type: type_,
            }
        )
        .on_conflict_do_nothing()
        .returning(Variable.id)
    )
    return await result.scalar()


async def _get_or_create_variable(
    project: UUID,
    name: str,
    type_: VariableType,
    *,
    conn: SAConnection,
    entity_cache: EntityCache,
) -> UUID:
    assert project and name and type_, (project, name, type_)
    id_ = entity_cache.variable[project].get(name)
    if id_ is None:  # not in cache
        id_ = await _select_variable(project, name, conn=conn)
        if id_ is None:  # not in db
            id_ = await _insert_variable(project, name, type_, conn=conn)
            if id_ is None:  # conflicting insert
                id_ = await _select_variable(project, name, conn=conn)
                assert id_ is not None  # must be in db
        entity_cache.variable[project][name] = id_
    return id_


async def _select_flag(project: UUID, name: str, *, conn: SAConnection) -> UUID:
    result = await conn.execute(
        select([Flag.id]).where(
            and_(Flag.project == project, Flag.name == name)
        )
    )
    return await result.scalar()


async def _insert_flag(project: UUID, name: str, *, conn: SAConnection) -> UUID:
    result = await conn.execute(
        insert(Flag.__table__)
        .values({Flag.id: uuid4(), Flag.project: project, Flag.name: name})
        .on_conflict_do_nothing()
        .returning(Flag.id)
    )
    return await result.scalar()


async def _get_or_create_flag(
    project: UUID,
    name: str,
    *,
    conn: SAConnection,
    entity_cache: EntityCache,
) -> UUID:
    assert project and name, (project, name)
    id_ = entity_cache.flag[project].get(name)
    if id_ is None:  # not in cache
        id_ = await _select_flag(project, name, conn=conn)
        if id_ is None:  # not in db
            id_ = await _insert_flag(project, name, conn=conn)
            if id_ is None:  # conflicting insert
                id_ = await _select_flag(project, name, conn=conn)
                assert id_ is not None  # must be in db
        entity_cache.flag[project][name] = id_
    return id_


async def add_statistics(
    op: service_pb2.ExchangeRequest,
    *,
    conn: SAConnection,
    entity_cache: EntityCache,
    flag_agg_stats: FlagAggStats,
) -> None:
    project = await _get_or_create_project(
        op.project,
        conn=conn,
        entity_cache=entity_cache,
    )
    for v in op.variables:
        await _get_or_create_variable(
            project,
            v.name,
            VariableType.from_pb(v.type),
            conn=conn,
            entity_cache=entity_cache,
        )
    for flag_usage in op.flags_usage:
        flag = await _get_or_create_flag(
            project,
            flag_usage.name,
            conn=conn,
            entity_cache=entity_cache,
        )

        s = flag_agg_stats[flag][flag_usage.interval.ToDatetime()]
        s[0] += flag_usage.positive_count
        s[1] += flag_usage.negative_count
