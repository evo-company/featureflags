import inspect

from uuid import uuid4
from datetime import datetime, timedelta

import faker

from sqlalchemy.engine import Row

from featureflags.utils import sel_first
from featureflags.models import Flag, Project, Variable
from featureflags.models import VariableType, Check, Operator, Condition
from featureflags.models import AuthSession, AuthUser, Changelog


f = faker.Faker()


async def _flush(db, model, data):
    values = await sel_first(
        db,
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


async def mk_auth_user(db, *, id=uuid4, username=f.pystr):
    return await _flush(
        db,
        AuthUser,
        dict(
            id=_val(id),
            username=_val(username),
        ),
    )


async def mk_auth_session(
    db,
    *,
    session=None,
    auth_user=None,
    creation_time=None,
    expiration_time=None,
):
    auth_user = auth_user or await mk_auth_user(db)
    return await _flush(
        db,
        AuthSession,
        dict(
            session=session or uuid4().hex,
            auth_user=auth_user.id,
            creation_time=creation_time or datetime.utcnow(),
            expiration_time=(
                expiration_time or datetime.utcnow() + timedelta(minutes=30)
            ),
        ),
    )


async def mk_project(db, *, id=uuid4, name=f.pystr, version=0):
    return await _flush(
        db,
        Project,
        dict(
            id=_val(id),
            name=_val(name),
            version=version,
        ),
    )


async def mk_variable(
    db, *, id=uuid4, name=f.pystr, type=VariableType.STRING, project=None
):
    project = project or await mk_project(db)
    return await _flush(
        db,
        Variable,
        dict(
            id=_val(id),
            name=_val(name),
            type=_val(type),
            project=project.id,
        ),
    )


async def mk_flag(db, *, id=uuid4, name=f.pystr, enabled=None, project=None):
    project = project or await mk_project(db)
    return await _flush(
        db,
        Flag,
        dict(
            id=_val(id),
            name=_val(name),
            enabled=_val(enabled),
            project=project.id,
        ),
    )


async def mk_check(
    db,
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
    variable = variable or await mk_variable(db, project=variable_project)
    return await _flush(
        db,
        Check,
        dict(
            id=_val(id),
            operator=_val(operator),
            variable=variable.id,
            value_string=_val(value_string),
            value_number=_val(value_number),
            value_timestamp=_val(value_timestamp),
            value_set=_val(value_set),
        ),
    )


async def mk_condition(db, *, id=uuid4, flag=None, checks=None, project=None):
    project = project or await mk_project(db)
    flag = flag or await mk_flag(db, project=project)
    checks = checks or [(await mk_check(db, variable_project=project)).id]
    return await _flush(
        db,
        Condition,
        dict(
            id=_val(id),
            flag=flag.id,
            checks=checks,
        ),
    )


async def mk_changelog_entry(
    db, *, timestamp=None, auth_user=None, flag=None, actions=tuple()
):
    auth_user = auth_user or await mk_auth_user(db)
    flag = flag or await mk_flag(db)
    return await _flush(
        db,
        Changelog,
        dict(
            timestamp=timestamp or datetime.utcnow(),
            auth_user=auth_user.id,
            flag=flag.id,
            actions=actions,
        ),
    )
