"""
    This module defines client -> server feedback, which is used to
    notify server about new projects/variables/flags
    TODO: refactor.
"""
from uuid import UUID, uuid4

from aiopg.sa import SAConnection
from sqlalchemy import and_, select
from sqlalchemy.dialects.postgresql import insert

from featureflags.http.types import (
    PreloadFlagsRequest,
)
from featureflags.http.types import (
    Variable as RequestVariable,
)
from featureflags.models import Flag, Project, Value, Variable
from featureflags.utils import EntityCache


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
    project: UUID, variable: RequestVariable, *, conn: SAConnection
) -> UUID:
    result = await conn.execute(
        select([Variable.id]).where(
            and_(Variable.project == project, Variable.name == variable.name)
        )
    )
    return await result.scalar()


async def _insert_variable(
    project: UUID, variable: RequestVariable, *, conn: SAConnection
) -> UUID:
    result = await conn.execute(
        insert(Variable.__table__)
        .values(
            {
                Variable.id: uuid4(),
                Variable.project: project,
                Variable.name: variable.name,
                Variable.type: variable.type,
            }
        )
        .on_conflict_do_nothing()
        .returning(Variable.id)
    )
    return await result.scalar()


async def _get_or_create_variable(
    project: UUID,
    variable: RequestVariable,
    *,
    conn: SAConnection,
    entity_cache: EntityCache,
) -> UUID:
    assert project and variable, (project, variable)
    id_ = entity_cache.variable[project].get(variable.name)
    if id_ is None:  # not in cache
        id_ = await _select_variable(project, variable, conn=conn)
        if id_ is None:  # not in db
            id_ = await _insert_variable(project, variable, conn=conn)
            if id_ is None:  # conflicting insert
                id_ = await _select_variable(project, variable, conn=conn)
                assert id_ is not None  # must be in db
        entity_cache.variable[project][variable.name] = id_
    return id_


async def _select_flag(project: UUID, name: str, *, conn: SAConnection) -> UUID:
    result = await conn.execute(
        select([Flag.id]).where(
            and_(Flag.project == project, Flag.name == name)
        )
    )
    return await result.scalar()


async def _insert_flag(
    project: UUID,
    name: str,
    *,
    conn: SAConnection,
) -> UUID | None:
    result = await conn.execute(
        insert(Flag.__table__)
        .values({Flag.id: uuid4(), Flag.project: project, Flag.name: name})
        .on_conflict_do_nothing()
        .returning(Flag.id)
    )
    return await result.scalar()


async def _get_or_create_flag(
    project: UUID,
    flag: str,
    *,
    conn: SAConnection,
    entity_cache: EntityCache,
) -> UUID:
    assert project and flag, (project, flag)
    id_ = entity_cache.flag[project].get(flag)
    if id_ is None:  # not in cache
        id_ = await _select_flag(project, flag, conn=conn)
        if id_ is None:  # not in db
            id_ = await _insert_flag(project, flag, conn=conn)
            if id_ is None:  # conflicting insert
                id_ = await _select_flag(project, flag, conn=conn)
                assert id_ is not None  # must be in db
        entity_cache.flag[project][flag] = id_
    return id_


async def _select_value(
    project: UUID,
    name: str,
    *,
    conn: SAConnection,
) -> UUID | None:
    result = await conn.execute(
        select([Value.id]).where(
            and_(Value.project == project, Value.name == name)
        )
    )
    return await result.scalar()


async def _insert_value(
    project: UUID,
    name: str,
    value_default: str,
    *,
    conn: SAConnection,
) -> UUID | None:
    result = await conn.execute(
        insert(Value.__table__)
        .values(
            {
                Value.id: uuid4(),
                Value.project: project,
                Value.name: name,
                Value.value_default: value_default,
                Value.value_override: value_default,
            }
        )
        .on_conflict_do_nothing()
        .returning(Value.id)
    )
    return await result.scalar()


async def _get_or_create_value(
    project: UUID,
    value: str,
    value_default: str,
    *,
    conn: SAConnection,
    entity_cache: EntityCache,
) -> UUID:
    assert project and value, (project, value)
    id_ = entity_cache.value[project].get(value)
    if id_ is None:  # not in cache
        id_ = await _select_value(project, value, conn=conn)
        if id_ is None:  # not in db
            id_ = await _insert_value(project, value, value_default, conn=conn)
            if id_ is None:  # conflicting insert
                id_ = await _select_value(project, value, conn=conn)
                assert id_ is not None  # must be in db
        entity_cache.value[project][value] = id_
    return id_


async def prepare_flags_project(
    request: PreloadFlagsRequest,
    conn: SAConnection,
    entity_cache: EntityCache,
) -> None:
    project = await _get_or_create_project(
        request.project,
        conn=conn,
        entity_cache=entity_cache,
    )
    for variable in request.variables:
        await _get_or_create_variable(
            project,
            variable,
            conn=conn,
            entity_cache=entity_cache,
        )
    for flag in request.flags:
        await _get_or_create_flag(
            project,
            flag,
            conn=conn,
            entity_cache=entity_cache,
        )
    for value in request.values:
        value_name, value_value_default = value
        await _get_or_create_value(
            project,
            value_name,
            str(value_value_default),
            conn=conn,
            entity_cache=entity_cache,
        )
