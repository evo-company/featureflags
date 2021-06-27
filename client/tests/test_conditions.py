import faker
import pytest

from google.protobuf.wrappers_pb2 import BoolValue

from featureflags.client.conditions import false, equal, less_than
from featureflags.client.conditions import less_or_equal, greater_than
from featureflags.client.conditions import greater_or_equal, contains, percent
from featureflags.client.conditions import regexp, wildcard, subset, superset
from featureflags.client.conditions import OPS, check_proc, flag_proc
from featureflags.protobuf.graph_pb2 import Result, Variable, Check, Flag, Ref
from featureflags.protobuf.graph_pb2 import Condition


f = faker.Faker()
undefined = object()


def check_op(left, op, right):
    return op('var', right)({'var': left} if left is not undefined else {})


def test_false():
    assert false({}) is False


def test_equal():
    assert check_op(1, equal, 1) is True
    assert check_op(2, equal, 1) is False
    assert check_op(1, equal, 2) is False
    assert check_op(1, equal, '1') is False
    assert check_op('1', equal, 1) is False
    assert check_op(undefined, equal, 1) is False


def test_less_than():
    assert check_op(1, less_than, 2) is True
    assert check_op(1, less_than, 1) is False
    assert check_op(2, less_than, 1) is False
    assert check_op(undefined, less_than, 1) is False
    assert check_op('1', less_than, 2) is False


def test_less_or_equal():
    assert check_op(1, less_or_equal, 2) is True
    assert check_op(1, less_or_equal, 1) is True
    assert check_op(2, less_or_equal, 1) is False
    assert check_op(undefined, less_or_equal, 1) is False
    assert check_op('1', less_or_equal, 2) is False


def test_greater_than():
    assert check_op(2, greater_than, 1) is True
    assert check_op(1, greater_than, 1) is False
    assert check_op(1, greater_than, 2) is False
    assert check_op(undefined, greater_than, 1) is False
    assert check_op('2', greater_than, 1) is False


def test_greater_or_equal():
    assert check_op(2, greater_or_equal, 1) is True
    assert check_op(1, greater_or_equal, 1) is True
    assert check_op(1, greater_or_equal, 2) is False
    assert check_op(undefined, greater_or_equal, 1) is False
    assert check_op('2', greater_or_equal, 1) is False


def test_contains():
    assert check_op('aaa', contains, 'a') is True
    assert check_op('aaa', contains, 'aa') is True
    assert check_op('aaa', contains, 'aaa') is True
    assert check_op('a', contains, 'aaa') is False
    assert check_op('aaa', contains, 'b') is False
    assert check_op(undefined, contains, 'a') is False
    assert check_op(1, contains, 'a') is False
    assert check_op('a', contains, 1) is False


def test_percent():
    assert check_op(0, percent, 1) is True
    assert check_op(1, percent, 1) is False
    assert check_op(1, percent, 2) is True

    for i in range(-150, 150):
        assert check_op(i, percent, 0) is False
    for i in range(-150, 150):
        assert check_op(i, percent, 100) is True

    assert check_op('foo', percent, 100) is True
    assert check_op('foo', percent, 0) is False
    assert check_op('foo', percent, hash('foo') % 100 + 1) is True
    assert check_op('foo', percent, hash('foo') % 100 - 1) is False

    assert check_op(undefined, percent, 100) is False


def test_regexp():
    assert check_op('anything', regexp, '.') is True
    assert check_op('kebab-style', regexp, r'\w+-\w+') is True
    assert check_op('snake_style', regexp, r'\w+-\w+') is False
    assert check_op(undefined, regexp, '.') is False
    assert check_op(1, regexp, '.') is False


def test_wildcard():
    assert check_op('foo-value', wildcard, 'foo-*') is True
    assert check_op('value-foo', wildcard, '*-foo') is True
    assert check_op('foo-value-bar', wildcard, 'foo-*-bar') is True
    assert check_op('value', wildcard, 'foo-*') is False
    assert check_op(undefined, wildcard, 'foo-*') is False
    assert check_op(1, wildcard, 'foo-*') is False


def test_subset():
    assert check_op(set('ab'), subset, set('abc')) is True
    assert check_op(set('bc'), subset, set('abc')) is True
    assert check_op(set('ac'), subset, set('abc')) is True
    assert check_op(set('ae'), subset, set('abc')) is False
    assert check_op(undefined, subset, set('abc')) is False
    assert check_op(1, subset, set('abc')) is False


def test_superset():
    assert check_op(set('abc'), superset, set('ab')) is True
    assert check_op(set('abc'), superset, set('bc')) is True
    assert check_op(set('abc'), superset, set('ac')) is True
    assert check_op(set('abc'), superset, set('ae')) is False
    assert check_op(undefined, superset, set('abc')) is False
    assert check_op(1, superset, set('abc')) is False


class Report(list):

    def add(self, error):
        self.append(error)


@pytest.fixture(name='variable')
def fixture_variable():
    return Variable(id=f.pystr(),
                    name=f.pystr(),
                    type=Variable.STRING)


@pytest.fixture(name='check')
def fixture_check(variable):
    return Check(id=f.pystr(),
                 variable=Ref(Variable=variable.id),
                 operator=Check.EQUAL,
                 value_string=f.pystr())


@pytest.fixture(name='condition')
def fixture_condition(check):
    return Condition(id=f.pystr(),
                     checks=[Ref(Check=check.id)])


@pytest.fixture(name='flag')
def fixture_flag(condition):
    return Flag(id=f.pystr(),
                name=f.pystr(),
                enabled=BoolValue(value=True),
                overridden=BoolValue(value=True),
                conditions=[Ref(Condition=condition.id)])


@pytest.fixture(name='result')
def fixture_result(variable, flag, condition, check):
    return Result(Variable={variable.id: variable},
                  Flag={flag.id: flag},
                  Condition={condition.id: condition},
                  Check={check.id: check})


class TestCheckProc:

    def _get_error(self, result, check_id):
        report = Report()
        assert check_proc(result, check_id, report) is false
        error, = report
        return error

    def test_valid(self, result, check, variable):
        proc = check_proc(result, check.id, Report())
        assert proc({variable.name: check.value_string}) is True
        assert proc({variable.name: ''}) is False

    def test_supported_ops(self):
        assert (set(OPS) | {0}) == set(Check.Operator.values())

    def test_no_variable(self, result, check):
        result.Check[check.id].ClearField('variable')
        assert 'variable is unset' in self._get_error(result, check.id)

    def test_no_operator(self, result, check):
        result.Check[check.id].ClearField('operator')
        assert 'operator is unset' in self._get_error(result, check.id)

    def test_no_value(self, result, check):
        result.Check[check.id].ClearField('value_string')
        assert 'kind is unset' in self._get_error(result, check.id)

    def test_invalid_var(self, result, check, variable):
        result.Variable[variable.id].ClearField('name')
        assert 'name is unset' in self._get_error(result, check.id)


class TestFlagProc:

    def _get_error(self, result, flag_id):
        report = Report()
        flag_proc(result, flag_id, report)
        error, = report
        return error

    def test_valid(self, result, flag, check, variable):
        proc = flag_proc(result, flag.id, Report())
        assert proc({variable.name: check.value_string}) is True

    def test_no_enabled(self, result, flag):
        result.Flag[flag.id].ClearField('enabled')
        assert 'enabled is unset' in self._get_error(result, flag.id)

    def test_empty_condition(self, result, flag, condition):
        del result.Condition[condition.id].checks[:]
        assert 'checks is empty' in self._get_error(result, flag.id)
