import uuid
from collections.abc import Iterable
from datetime import datetime
from uuid import UUID, uuid4

import sqlalchemy
from aiopg.sa import SAConnection
from hiku.sources.aiopg import (
    LinkQuery as _LinkQuery,
)
from sqlalchemy import and_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.sql.selectable import Select

from featureflags.graph.types import (
    LocalId,
)
from featureflags.models import (
    AuthUser,
    LocalIdMap,
)
from featureflags.utils import select_scalar


def is_valid_uuid(value: str) -> bool:
    try:
        uuid.UUID(value)
    except ValueError:
        return False
    else:
        return True


def update_map(map_: dict, update: dict) -> dict:
    map_ = map_.copy()
    map_.update(update)
    return map_


async def gen_id(local_id: LocalId, *, conn: SAConnection) -> UUID:
    assert local_id.scope and local_id.value, local_id

    # try to insert new local id. if it already exists, return None,
    # otherwise return the id
    id_ = await select_scalar(
        conn,
        (
            insert(LocalIdMap.__table__)
            .values(
                {
                    LocalIdMap.scope: local_id.scope,
                    LocalIdMap.value: local_id.value,
                    LocalIdMap.id: uuid4(),
                    LocalIdMap.timestamp: datetime.utcnow(),
                }
            )
            .on_conflict_do_nothing()
            .returning(LocalIdMap.id)
        ),
    )
    # if previous insert returned None, it means that the id already exists,
    # try to select the id
    if id_ is None:
        id_ = await select_scalar(
            conn,
            (
                select([LocalIdMap.id]).where(
                    and_(
                        LocalIdMap.scope == local_id.scope,
                        LocalIdMap.value == local_id.value,
                    )
                )
            ),
        )
    return id_


async def get_auth_user(username: str, *, conn: SAConnection) -> UUID:
    user_id_select = select([AuthUser.id]).where(AuthUser.username == username)
    user_id = await select_scalar(conn, user_id_select)
    if user_id is None:
        user_id = await select_scalar(
            conn,
            (
                insert(AuthUser.__table__)
                .values(
                    {
                        AuthUser.id: uuid4(),
                        AuthUser.username: username,
                    }
                )
                .on_conflict_do_nothing()
                .returning(AuthUser.id)
            ),
        )
        if user_id is None:
            user_id = await select_scalar(conn, user_id_select)
            assert user_id is not None
    return user_id


class LinkQuery(_LinkQuery):
    """LinkQuery with support for ordering results."""

    def __init__(
        self,
        engine_key: str,
        *,
        from_column: sqlalchemy.Column,
        to_column: sqlalchemy.Column,
        order_by: list[sqlalchemy.Column] | None = None,
    ) -> None:
        super().__init__(
            engine_key, from_column=from_column, to_column=to_column
        )
        self.order_by = order_by or []

    def select_expr(self, ids: Iterable) -> Select | None:
        expr = super().select_expr(ids)
        if expr is not None and self.order_by:
            expr = expr.order_by(*self.order_by)
        return expr
