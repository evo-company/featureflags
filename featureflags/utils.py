from collections import defaultdict
from typing import Any

from aiopg.sa import Engine, SAConnection
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Query


class ArrayOfEnum(ARRAY):
    """
    See: http://docs.sqlalchemy.org/en/latest/dialects/postgresql.html#using
    -enum-with-array  # noqa: E501
    """

    def bind_expression(self, bind_value: Any) -> Any:
        return cast(bind_value, self)

    def result_processor(self, dialect: Any, col_type: Any) -> Any:
        proc = super().result_processor(dialect, col_type)

        def wrapper(value: Any) -> Any:
            if value is None:
                return None
            else:
                value = value[1:-1]
                if value:
                    return proc(value.split(","))
                elif self.as_tuple:
                    return ()

                return []

        return wrapper


class EntityCache:
    """
    Caches entity ids during request
    """

    def __init__(self) -> None:
        self.project = {}
        self.flag = defaultdict(dict)
        self.variable = defaultdict(dict)


class FlagAggStats(defaultdict):
    """
    Used to collect flags statistics in aggregated state

    acc[interval][flag] -> [positive_count, negative_count]
    """

    def __init__(self) -> None:
        super().__init__(lambda: defaultdict(lambda: [0, 0]))


async def select_scalar(conn: SAConnection, stmt: Query) -> Any:
    result = await conn.execute(stmt)
    return await result.scalar()


async def exec_scalar(engine: Engine, stmt: Query) -> Any:
    async with engine.acquire() as conn:
        return await select_scalar(conn, stmt)


async def select_first(conn: SAConnection, stmt: Query) -> Any:
    result = await conn.execute(stmt)
    row = await result.first()
    if row is not None:
        return row  # FIXME: KeyedTuple?
    else:
        return None


async def exec_expression(engine: Engine, stmt: Query) -> Any:
    async with engine.acquire() as conn:
        result = await conn.execute(stmt)
        return [r[0] for r in await result.fetchall()]


def escape_dn_chars(s: str) -> str:
    """
    Escape all DN special characters found in s
    with a back-slash (see RFC 4514, section 2.4)

    From python-ldap, which is distributed under Python-style license.
    """
    if s:
        s = (
            s.replace("\\", "\\\\")
            .replace(",", "\\,")
            .replace("+", "\\+")
            .replace('"', '\\"')
            .replace("<", "\\<")
            .replace(">", "\\>")
            .replace(";", "\\;")
            .replace("=", "\\=")
            .replace("\000", "\\\000")
        )

        if s.startswith("#") or s.startswith(" "):
            s = "".join(("\\", s))

        if s.endswith(" "):
            s = "".join((s[:-1], "\\ "))

    return s
