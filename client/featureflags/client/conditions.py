import re

from featureflags.protobuf.graph_pb2 import Check


_undefined = object()


def false(ctx):
    return False


def except_false(func):
    def wrapper(ctx):
        try:
            return func(ctx)
        except TypeError:
            return False
    return wrapper


def equal(name, value):
    @except_false
    def proc(ctx):
        return ctx.get(name, _undefined) == value
    return proc


def less_than(name, value):
    @except_false
    def proc(ctx):
        ctx_val = ctx.get(name, _undefined)
        ctx_val + 0  # quick type checking in Python 2
        return ctx_val is not _undefined and ctx_val < value
    return proc


def less_or_equal(name, value):
    @except_false
    def proc(ctx):
        ctx_val = ctx.get(name, _undefined)
        ctx_val + 0  # quick type checking in Python 2
        return ctx_val is not _undefined and ctx_val <= value
    return proc


def greater_than(name, value):
    @except_false
    def proc(ctx):
        ctx_val = ctx.get(name, _undefined)
        ctx_val + 0  # quick type checking in Python 2
        return ctx_val is not _undefined and ctx_val > value
    return proc


def greater_or_equal(name, value):
    @except_false
    def proc(ctx):
        ctx_val = ctx.get(name, _undefined)
        ctx_val + 0  # quick type checking in Python 2
        return ctx_val is not _undefined and ctx_val >= value
    return proc


def contains(name, value):
    @except_false
    def proc(ctx):
        return value in ctx.get(name, '')
    return proc


def percent(name, value):
    @except_false
    def proc(ctx):
        ctx_val = ctx.get(name, _undefined)
        return ctx_val is not _undefined and hash(ctx_val) % 100 < value
    return proc


def regexp(name, value):
    @except_false
    def proc(ctx, _re=re.compile(value)):
        return _re.match(ctx.get(name, '')) is not None
    return proc


def wildcard(name, value):
    re_ = '^' + '(?:.*)'.join(map(re.escape, value.split('*'))) + '$'
    return regexp(name, re_)


def subset(name, value):
    if value:
        @except_false
        def proc(ctx, _value=set(value)):
            ctx_val = ctx.get(name)
            return bool(ctx_val) and _value.issuperset(ctx_val)
    else:
        proc = false
    return proc


def superset(name, value):
    if value:
        @except_false
        def proc(ctx, _value=set(value)):
            ctx_val = ctx.get(name)
            return bool(ctx_val) and _value.issubset(ctx_val)
    else:
        proc = false
    return proc


OPS = {
    Check.EQUAL: equal,
    Check.LESS_THAN: less_than,
    Check.LESS_OR_EQUAL: less_or_equal,
    Check.GREATER_THAN: greater_than,
    Check.GREATER_OR_EQUAL: greater_or_equal,
    Check.CONTAINS: contains,
    Check.PERCENT: percent,
    Check.REGEXP: regexp,
    Check.WILDCARD: wildcard,
    Check.SUBSET: subset,
    Check.SUPERSET: superset,
}


class DummyReport:

    def add(self, error):
        pass


def check_proc(result, check_id, report):
    check = result.Check[check_id]
    if not check.variable.Variable:
        report.add('Check[{}].variable is unset'.format(check_id))
        return false
    if check.operator == Check.__DEFAULT__:
        report.add('Check[{}].operator is unset'.format(check_id))
        return false
    kind = check.WhichOneof('kind')
    if not kind:
        report.add('Check[{}].kind is unset'.format(check_id))
        return false
    variable = result.Variable[check.variable.Variable]
    if not variable.name:
        report.add('Variable[{}].name is unset'.format(check.variable))
        return false
    value = getattr(check, check.WhichOneof('kind'))
    # TODO: check value type and if operator is supported
    return OPS[check.operator](variable.name, value)


def flag_proc(result, flag_id, report):
    flag = result.Flag[flag_id]
    if not flag.HasField('overridden'):
        report.add('Flag[{}].overridden is unset'.format(flag_id))
        return None
    if not flag.HasField('enabled'):
        report.add('Flag[{}].enabled is unset'.format(flag_id))
        return false
    if not flag.overridden.value:
        return None

    conditions = []
    for condition_ref in flag.conditions:
        condition = result.Condition[condition_ref.Condition]
        checks = [check_proc(result, check_ref.Check, report)
                  for check_ref in condition.checks]
        if checks:
            conditions.append(checks)
        else:
            report.add('Condition[{}].checks is empty'
                       .format(condition_ref.Condition))
            # in case of invalid condition it would be safe to replace it
            # with a falsish condition
            conditions.append([false])

    if flag.enabled.value and conditions:
        def proc(ctx):
            return any(all(check(ctx) for check in checks_)
                       for checks_ in conditions)
    else:
        def proc(ctx):
            return flag.enabled.value
    return proc


def load_flags(result, report=DummyReport()):
    procs = {}
    for flag_ref in result.Root.flags:
        flag = result.Flag[flag_ref.Flag]
        if not flag.name:
            report.add('Flag[{}].name is not set'.format(flag_ref.Flag))
            continue
        proc = flag_proc(result, flag_ref.Flag, report)
        if proc is not None:
            procs[flag.name] = proc
    return procs
