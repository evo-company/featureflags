from unittest.mock import patch

import faker
import pytest

from grpclib.client import Channel
from google.protobuf import wrappers_pb2

from featureflags.protobuf import service_pb2, graph_pb2
from featureflags.client.state import get_query
from featureflags.client.flags import Client, Variable, Types
from featureflags.client.managers.asyncio import AsyncIOManager


f = faker.Faker()


class Defaults:
    TEST = False


@pytest.fixture(name='variable')
def fixture_variable():
    return graph_pb2.Variable(id=f.pystr(), name=f.pystr(),
                              type=graph_pb2.Variable.STRING)


@pytest.fixture(name='check')
def fixture_check(variable):
    return graph_pb2.Check(id=f.pystr(),
                           variable=graph_pb2.Ref(Variable=variable.id),
                           operator=graph_pb2.Check.EQUAL,
                           value_string=f.pystr())


@pytest.fixture(name='condition')
def fixture_condition(check):
    return graph_pb2.Condition(id=f.pystr(),
                               checks=[graph_pb2.Ref(Check=check.id)])


@pytest.fixture(name='flag')
def fixture_flag(condition):
    return graph_pb2.Flag(id=f.pystr(), name=f.pystr(),
                          enabled=wrappers_pb2.BoolValue(value=True),
                          overridden=wrappers_pb2.BoolValue(value=True),
                          conditions=[graph_pb2.Ref(Condition=condition.id)])


@pytest.fixture(name='result')
def fixture_result(variable, flag, condition, check):
    result = graph_pb2.Result()
    result.Root.flags.extend([graph_pb2.Ref(Flag=flag.id)])
    result.Variable[variable.id].CopyFrom(variable)
    result.Flag[flag.id].CopyFrom(flag)
    result.Condition[condition.id].CopyFrom(condition)
    result.Check[check.id].CopyFrom(check)
    return result


@pytest.mark.asyncio
async def test(loop, result, flag, variable, check):
    result.Flag[flag.id].name = 'TEST'
    variables = [Variable(variable.name, Types.STRING)]
    manager = AsyncIOManager('aginst', variables, Channel(port=-1, loop=loop),
                             loop=loop)

    async def reply():
        return service_pb2.ExchangeReply(version=1, result=result)

    with patch.object(manager._stub, 'Exchange') as exchange:
        exchange.return_value = reply()
        await manager.preload()
        exchange.assert_called_once_with(service_pb2.ExchangeRequest(
            project='aginst',
            variables=[
                service_pb2.Variable(name=variable.name,
                                     type=graph_pb2.Variable.STRING),
            ],
            query=get_query('aginst'),
        ), timeout=None)

    client = Client(Defaults, manager)
    with client.flags({variable.name: check.value_string}) as flags:
        assert flags.TEST is True
    with client.flags({variable.name: f.pystr()}) as flags:
        assert flags.TEST is False
    with client.flags({variable.name: check.value_string}) as flags:
        assert flags.TEST is True
