from uuid import UUID, uuid4
from typing import Optional
from dataclasses import dataclass

import pytest
import aiopg.sa
import hiku.engine

from sqlalchemy import select
from hiku.builder import build, Q
from sanic.exceptions import Unauthorized
from hiku.export.protobuf import export

from featureflags.protobuf import backend_pb2
from featureflags.server.auth import TestSession
from featureflags.server.schema import Flag
from featureflags.server.web.backend import call

from state import mk_flag, mk_auth_user


@dataclass
class AppStub:
    sa_engine: aiopg.sa.Engine
    hiku_engine: hiku.engine.Engine
    ldap = None


@dataclass
class RequestStub:
    app: AppStub
    body: bytes
    user: Optional[UUID] = None

    def __getitem__(self, item):
        if item == 'session':
            return TestSession(self.user)
        else:
            raise KeyError(item)


async def check_flag(flag, *, db):
    result = await db.execute(
        select([Flag.enabled]).where(Flag.id == flag)
    )
    return await result.scalar()


@pytest.mark.asyncio
@pytest.mark.parametrize('user', [uuid4(), None])
async def test_query(user, sa, hiku_engine):
    pb_request = backend_pb2.Request(query=export(build([Q.authenticated])))

    app = AppStub(sa_engine=sa, hiku_engine=hiku_engine)
    response = await call(RequestStub(app=app,
                                      body=pb_request.SerializeToString(),
                                      user=user))

    pb_response = backend_pb2.Reply.FromString(response.body)
    assert pb_response.result.Root.authenticated is (user is not None)


@pytest.mark.asyncio
@pytest.mark.parametrize('authenticated', [True, False])
async def test_operations(authenticated, sa, db, hiku_engine):
    flag = await mk_flag(db, enabled=True)

    pb_request = backend_pb2.Request(operations=[
        backend_pb2.Operation(
            disable_flag=backend_pb2.DisableFlag(
                flag_id=backend_pb2.Id(value=flag.id.hex),
            )
        ),
    ])

    app = AppStub(sa_engine=sa, hiku_engine=hiku_engine)

    async def make_call(*, user):
        return await call(RequestStub(
            app=app,
            body=pb_request.SerializeToString(),
            user=user,
        ))

    if authenticated:
        await make_call(user=(await mk_auth_user(db)).id)
        assert await check_flag(flag.id, db=db) is False
    else:
        with pytest.raises(Unauthorized):
            await make_call(user=None)
