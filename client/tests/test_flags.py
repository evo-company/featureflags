from enum import Enum
from datetime import timedelta

import faker
import pytest

from google.protobuf.timestamp_pb2 import Timestamp

from featureflags.client.flags import Flags, Tracer, Client
from featureflags.client.flags import StatsCollector
from featureflags.protobuf.graph_pb2 import Check, Variable, Result
from featureflags.protobuf.service_pb2 import FlagUsage
from featureflags.client.managers.dummy import DummyManager


f = faker.Faker()


def test_tracing(manager):
    defaults = {'TEST': False}

    result = Result()
    flag_id = f.pystr()
    result.Root.flags.add().Flag = flag_id
    result.Flag[flag_id].id = flag_id
    result.Flag[flag_id].name = 'TEST'
    result.Flag[flag_id].enabled.value = True
    result.Flag[flag_id].overridden.value = True
    manager.load(result)

    with Tracer() as tracer:
        flags = Flags(defaults, manager, tracer, {})
        assert flags.TEST is True

        result.Flag[flag_id].enabled.value = False
        manager.load(result)
        assert flags.TEST is True

    assert tracer.values == {'TEST': True}
    assert tracer.interval.second == 0
    assert tracer.interval.microsecond == 0

    interval_pb = Timestamp()
    interval_pb.FromDatetime(tracer.interval)

    stats = StatsCollector()
    stats.update(tracer.interval, tracer.values)

    assert stats.flush(timedelta(0)) == [
        FlagUsage(name='TEST', interval=interval_pb,
                  positive_count=1, negative_count=0),
    ]


def test_tracing_history():
    client = Client({'FOO': True, 'BAR': False, 'BAZ': True},
                    DummyManager())

    with client.flags() as f1:
        print(f1.FOO)
        print(f1.BAR)
        print(f1.FOO)
    assert f1.__history__() == [
        ('FOO', True),
        ('BAR', False),
    ]

    with client.flags() as f2:
        print(f2.BAR)
        print(f2.FOO)
        print(f2.BAR)
    assert f2.__history__() == [
        ('BAR', False),
        ('FOO', True),
    ]


@pytest.mark.parametrize('ctx, expected', [
    # check 1 condition
    ({'v.str': 'durango', 'v.int': 1001}, True),
    ({'v.str': 'durango1', 'v.int': 1001}, False),
    ({'v.str': 'durango', 'v.int': 999}, False),
    # check 2 condition
    ({'v.str': 'aleph-yes', 'v.int': 49}, True),
    ({'v.str': 'aleph-yes', 'v.int': 50}, False),
    ({'v.str': 'aleph+no', 'v.int': 49}, False),
])
def test_conditions(ctx, expected, manager):
    f1 = f.pystr()
    c1, c2 = f.pystr(), f.pystr()
    ch1, ch2, ch3, ch4 = f.pystr(), f.pystr(), f.pystr(), f.pystr()
    v1, v2 = f.pystr(), f.pystr()

    result = Result()
    result.Root.flags.add().Flag = f1

    result.Variable[v1].id = v1
    result.Variable[v1].name = 'v.str'
    result.Variable[v1].type = Variable.STRING

    result.Variable[v2].id = v2
    result.Variable[v2].name = 'v.int'
    result.Variable[v2].type = Variable.NUMBER

    result.Flag[f1].id = f1
    result.Flag[f1].name = 'TEST'
    result.Flag[f1].enabled.value = True
    result.Flag[f1].overridden.value = True
    result.Flag[f1].conditions.add().Condition = c1
    result.Flag[f1].conditions.add().Condition = c2

    result.Condition[c1].id = c1
    result.Condition[c1].checks.add().Check = ch1
    result.Condition[c1].checks.add().Check = ch2

    result.Condition[c2].id = c2
    result.Condition[c2].checks.add().Check = ch3
    result.Condition[c2].checks.add().Check = ch4

    result.Check[ch1].id = ch1
    result.Check[ch1].variable.Variable = v1
    result.Check[ch1].operator = Check.EQUAL
    result.Check[ch1].value_string = 'durango'

    result.Check[ch2].id = ch2
    result.Check[ch2].variable.Variable = v2
    result.Check[ch2].operator = Check.GREATER_THAN
    result.Check[ch2].value_number = 1000

    result.Check[ch3].id = ch3
    result.Check[ch3].variable.Variable = v1
    result.Check[ch3].operator = Check.WILDCARD
    result.Check[ch3].value_string = 'aleph-*'

    result.Check[ch4].id = ch4
    result.Check[ch4].variable.Variable = v2
    result.Check[ch4].operator = Check.PERCENT
    result.Check[ch4].value_number = 50

    defaults = {'TEST': False}

    manager.load(result)
    with Tracer() as tracer:
        flags = Flags(defaults, manager, tracer, ctx)
        assert flags.TEST is expected


def test_py2_defaults(manager):
    client = Client({'TEST': False, u'TEST_UNICODE': True}, manager)
    with client.flags() as flags:
        assert flags.TEST is False
        assert flags.TEST_UNICODE is True


def test_deprecated_defaults(manager):
    class Defaults(Enum):
        TEST = False

    client = Client(Defaults, manager)
    with client.flags() as flags:
        assert flags.TEST is Defaults.TEST.value


def test_declarative_defaults(manager):
    class Defaults:
        _TEST = True
        TEST = False
        test = True

    client = Client(Defaults, manager)
    with client.flags() as flags:
        assert not hasattr(flags, '_TEST')
        assert flags.TEST is Defaults.TEST
        assert not hasattr(flags, 'test')


def test_invalid_defaults_type(manager):
    with pytest.raises(TypeError) as exc:
        Client(object(), manager)
    exc.match('Invalid defaults type')


@pytest.mark.parametrize('key, value', [('TEST', 1), (2, 'TEST')])
def test_invalid_flag_definition_types(key, value, manager):
    with pytest.raises(TypeError) as exc:
        Client({key: value}, manager)
    exc.match('Invalid flag definition: {!r}'.format(key))


def test_overrides(manager):
    class Defaults(Enum):
        TEST = False

    client = Client(Defaults, manager)

    with client.flags() as flags:
        assert flags.TEST is False

    with client.flags(overrides={'TEST': True}) as flags:
        assert flags.TEST is True


def test_default_true(manager):
    result = Result()
    flag_id = f.pystr()
    result.Root.flags.add().Flag = flag_id
    result.Flag[flag_id].id = flag_id
    result.Flag[flag_id].name = 'TEST'
    result.Flag[flag_id].enabled.value = False
    result.Flag[flag_id].overridden.value = False
    manager.load(result)

    class Defaults:
        TEST = True

    client = Client(Defaults, manager)
    with client.flags() as flags:
        assert flags.TEST is Defaults.TEST
