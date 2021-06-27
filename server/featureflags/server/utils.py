import inspect
import collections

from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import ARRAY


def requires(func):
    sign = inspect.signature(func)
    func.__requires__ = {p.name for p in sign.parameters.values()
                         if p.kind is inspect.Parameter.KEYWORD_ONLY}
    return func


class MC:
    """
    Caches entity ids during request
    """
    def __init__(self):
        self.project = {}
        self.flag = collections.defaultdict(dict)
        self.variable = collections.defaultdict(dict)


class ACC(collections.defaultdict):
    """
    Used to collect flags statistics in aggregated state

    acc[interval][flag] -> [positive_count, negative_count]
    """
    def __init__(self):
        super().__init__(lambda: collections.defaultdict(lambda: [0, 0]))


async def sel_scalar(conn, stmt):
    result = await conn.execute(stmt)
    return await result.scalar()


async def exec_scalar(engine, stmt):
    async with engine.acquire() as conn:
        return await sel_scalar(conn, stmt)


async def sel_first(conn, stmt):
    result = await conn.execute(stmt)
    row = await result.first()
    if row is not None:
        return row  # FIXME: KeyedTuple?
    else:
        return None


async def exec_expr(engine, stmt):
    async with engine.acquire() as conn:
        result = await conn.execute(stmt)
        return [r[0] for r in await result.fetchall()]


class ArrayOfEnum(ARRAY):
    """
    See: http://docs.sqlalchemy.org/en/latest/dialects/postgresql.html#using-enum-with-array  # noqa: E501
    """
    def bind_expression(self, bind_value):
        return cast(bind_value, self)

    def result_processor(self, dialect, col_type):
        proc = super().result_processor(dialect, col_type)

        def wrapper(value):
            if value is None:
                return None
            else:
                value = value[1:-1]
                if value:
                    return proc(value.split(','))
                else:
                    if self.as_tuple:
                        return tuple()
                    else:
                        return []
        return wrapper
