import contextvars
import inspect
from datetime import datetime, timedelta
from uuid import uuid4

import faker

from featureflags.models import (
    AuthSession,
    AuthUser,
    Changelog,
    Check,
    Condition,
    Flag,
    Operator,
    Project,
    Value,
    ValueChangelog,
    ValueCondition,
    Variable,
    VariableType,
)
from featureflags.services.auth import BaseUserSession
from featureflags.utils import select_first

f = faker.Faker()


def mk_session_var(
    session: BaseUserSession,
) -> contextvars.ContextVar[BaseUserSession]:
    test_user_session = contextvars.ContextVar("user_session")
    test_user_session.set(session)
    return test_user_session


async def _flush(db_engine, model, data):
    async with db_engine.acquire() as conn:
        values = await select_first(
            conn,
            (
                model.__table__.insert()
                .values(data)
                .returning(*model.__table__.columns)
            ),
        )
    return values


def _val(value):
    if inspect.isfunction(value) or inspect.ismethod(value):
        return value()
    else:
        return value


async def mk_auth_user(db_engine, *, id=uuid4, username=f.pystr):
    return await _flush(
        db_engine,
        AuthUser,
        {
            "id": _val(id),
            "username": _val(username),
        },
    )


async def mk_auth_session(
    db_engine,
    *,
    session=None,
    auth_user=None,
    creation_time=None,
    expiration_time=None,
):
    auth_user = auth_user or await mk_auth_user(db_engine)
    return await _flush(
        db_engine,
        AuthSession,
        {
            "session": session or uuid4().hex,
            "auth_user": auth_user.id,
            "creation_time": creation_time or datetime.utcnow(),
            "expiration_time": (
                expiration_time or datetime.utcnow() + timedelta(minutes=30)
            ),
        },
    )


async def mk_project(db_engine, *, id=uuid4, name=f.pystr, version=0):
    return await _flush(
        db_engine,
        Project,
        {
            "id": _val(id),
            "name": _val(name),
            "version": version,
        },
    )


async def mk_variable(
    db_engine, *, id=uuid4, name=f.pystr, type=VariableType.STRING, project=None
):
    project = project or await mk_project(db_engine)
    return await _flush(
        db_engine,
        Variable,
        {
            "id": _val(id),
            "name": _val(name),
            "type": _val(type),
            "project": project.id,
        },
    )


async def mk_flag(
    db_engine, *, id=uuid4, name=f.pystr, enabled=None, project=None
):
    project = project or await mk_project(db_engine)
    return await _flush(
        db_engine,
        Flag,
        {
            "id": _val(id),
            "name": _val(name),
            "enabled": _val(enabled),
            "project": project.id,
        },
    )


async def mk_check(
    db_engine,
    *,
    id=uuid4,
    operator=Operator.EQUAL,
    variable=None,
    value_string=f.pystr,
    value_number=None,
    value_timestamp=None,
    value_set=None,
    variable_project=None,
):
    variable = variable or await mk_variable(
        db_engine, project=variable_project
    )
    return await _flush(
        db_engine,
        Check,
        {
            "id": _val(id),
            "operator": _val(operator),
            "variable": variable.id,
            "value_string": _val(value_string),
            "value_number": _val(value_number),
            "value_timestamp": _val(value_timestamp),
            "value_set": _val(value_set),
        },
    )


async def mk_condition(
    db_engine, *, id=uuid4, flag=None, checks=None, project=None
):
    project = project or await mk_project(db_engine)
    flag = flag or await mk_flag(db_engine, project=project)
    checks = checks or [
        (await mk_check(db_engine, variable_project=project)).id
    ]
    return await _flush(
        db_engine,
        Condition,
        {
            "id": _val(id),
            "flag": flag.id,
            "checks": checks,
        },
    )


async def mk_changelog_entry(
    db_engine, *, timestamp=None, auth_user=None, flag=None, actions=()
):
    auth_user = auth_user or await mk_auth_user(db_engine)
    flag = flag or await mk_flag(db_engine)
    return await _flush(
        db_engine,
        Changelog,
        {
            "timestamp": timestamp or datetime.utcnow(),
            "auth_user": auth_user.id,
            "flag": flag.id,
            "actions": actions,
        },
    )


async def mk_value(
    db_engine,
    *,
    id=uuid4,
    name=f.pystr,
    enabled=None,
    project=None,
    value_default=f.pystr,
    value_override=f.pystr,
):
    project = project or await mk_project(db_engine)
    return await _flush(
        db_engine,
        Value,
        {
            "id": _val(id),
            "name": _val(name),
            "enabled": _val(enabled),
            "project": project.id,
            "value_default": _val(value_default),
            "value_override": _val(value_override),
        },
    )


async def mk_value_condition(
    db_engine,
    *,
    id=uuid4,
    value=None,
    checks=None,
    project=None,
    value_override=f.pystr,
):
    project = project or await mk_project(db_engine)
    value = value or await mk_value(db_engine, project=project)
    checks = checks or [
        (await mk_check(db_engine, variable_project=project)).id
    ]
    return await _flush(
        db_engine,
        ValueCondition,
        {
            "id": _val(id),
            "value": value.id,
            "checks": checks,
            "value_override": _val(value_override),
        },
    )


async def mk_value_changelog_entry(
    db_engine, *, timestamp=None, auth_user=None, value=None, actions=()
):
    auth_user = auth_user or await mk_auth_user(db_engine)
    value = value or await mk_value(db_engine)
    return await _flush(
        db_engine,
        ValueChangelog,
        {
            "timestamp": timestamp or datetime.utcnow(),
            "auth_user": auth_user.id,
            "value": value.id,
            "actions": actions,
        },
    )
