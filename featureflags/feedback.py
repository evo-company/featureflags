"""
    This module defines client -> server feedback, which is used to
    notify server about new projects/variables/flags
"""
from uuid import uuid4

from sqlalchemy import select, and_
from sqlalchemy.dialects.postgresql import insert

from featureflags_protobuf import service_pb2

from featureflags.utils import MC, ACC
from featureflags.schema import Type
from featureflags.schema import Flag, Project, Variable


async def _select_project(name, *, db):
    result = await db.execute(select([Project.id]).where(Project.name == name))
    return await result.scalar()


async def _insert_project(name, *, db):
    result = await db.execute(
        insert(Project.__table__)
        .values({Project.id: uuid4(), Project.name: name, Project.version: 0})
        .on_conflict_do_nothing()
        .returning(Project.id)
    )
    return await result.scalar()


async def _get_or_create_project(name, *, db, mc: MC):
    assert name
    id_ = mc.project.get(name)
    if id_ is None:  # not in cache
        id_ = await _select_project(name, db=db)
        if id_ is None:  # not in db
            id_ = await _insert_project(name, db=db)
            if id_ is None:  # conflicting insert
                id_ = await _select_project(name, db=db)
                assert id_ is not None  # must be in db
        mc.project[name] = id_
    return id_


async def _select_variable(project, name, *, db):
    result = await db.execute(
        select([Variable.id]).where(
            and_(Variable.project == project, Variable.name == name)
        )
    )
    return await result.scalar()


async def _insert_variable(project, name, type_, *, db):
    result = await db.execute(
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


async def _get_or_create_variable(project, name, type_, *, db, mc: MC):
    assert project and name and type_, (project, name, type_)
    id_ = mc.variable[project].get(name)
    if id_ is None:  # not in cache
        id_ = await _select_variable(project, name, db=db)
        if id_ is None:  # not in db
            id_ = await _insert_variable(project, name, type_, db=db)
            if id_ is None:  # conflicting insert
                id_ = await _select_variable(project, name, db=db)
                assert id_ is not None  # must be in db
        mc.variable[project][name] = id_
    return id_


async def _select_flag(project, name, *, db):
    result = await db.execute(
        select([Flag.id]).where(
            and_(Flag.project == project, Flag.name == name)
        )
    )
    return await result.scalar()


async def _insert_flag(project, name, *, db):
    result = await db.execute(
        insert(Flag.__table__)
        .values({Flag.id: uuid4(), Flag.project: project, Flag.name: name})
        .on_conflict_do_nothing()
        .returning(Flag.id)
    )
    return await result.scalar()


async def _get_or_create_flag(project, name, *, db, mc: MC):
    assert project and name, (project, name)
    id_ = mc.flag[project].get(name)
    if id_ is None:  # not in cache
        id_ = await _select_flag(project, name, db=db)
        if id_ is None:  # not in db
            id_ = await _insert_flag(project, name, db=db)
            if id_ is None:  # conflicting insert
                id_ = await _select_flag(project, name, db=db)
                assert id_ is not None  # must be in db
        mc.flag[project][name] = id_
    return id_


async def add_statistics(
    op: service_pb2.ExchangeRequest, *, db, mc: MC, acc: ACC
):
    project = await _get_or_create_project(op.project, db=db, mc=mc)
    for v in op.variables:
        await _get_or_create_variable(
            project, v.name, Type.from_pb(v.type), db=db, mc=mc
        )
    for flag_usage in op.flags_usage:
        flag = await _get_or_create_flag(project, flag_usage.name, db=db, mc=mc)

        s = acc[flag][flag_usage.interval.ToDatetime()]
        s[0] += flag_usage.positive_count
        s[1] += flag_usage.negative_count
