import aiopg.sa
from hiku.builder import Q, build
from hiku.engine import Engine
from hiku.expr.nodes import Node
from sqlalchemy import select

from featureflags.graph.graph import exec_denormalize_graph
from featureflags.http.db import prepare_flags_project
from featureflags.http.types import (
    Flag,
    PreloadFlagsRequest,
    PreloadFlagsResponse,
    SyncFlagsRequest,
    SyncFlagsResponse,
)
from featureflags.models import Project
from featureflags.services.auth import user_session
from featureflags.utils import EntityCache, select_scalar


def load_flags_query(project: str) -> Node:
    return build(
        [
            Q.flags(project_name=project)[
                Q.id,
                Q.name,
                Q.enabled,
                Q.overridden,
                Q.conditions[
                    Q.id,
                    Q.checks[
                        Q.id,
                        Q.variable[
                            Q.id,
                            Q.name,
                            Q.type,
                        ],
                        Q.operator,
                        Q.value_string,
                        Q.value_number,
                        Q.value_timestamp,
                        Q.value_set,
                    ],
                ],
            ],
        ]
    )


class FlagsRepository:
    def __init__(
        self,
        db_engine: aiopg.sa.Engine,
        graph_engine: Engine,
    ) -> None:
        self._db_engine = db_engine
        self._graph_engine = graph_engine

        self._entity_cache = EntityCache()

    async def get_current_version(self, project: str) -> str:
        async with self._db_engine.acquire() as db_connection:
            return await select_scalar(
                db_connection,
                select([Project.version]).where(Project.name == project),
            )

    async def _prepare_flags_project(
        self,
        request: PreloadFlagsRequest,
    ) -> None:
        async with self._db_engine.acquire() as db_connection:
            await prepare_flags_project(
                request,
                db_connection=db_connection,
                entity_cache=self._entity_cache,
            )

    async def preload_flags(
        self,
        request: PreloadFlagsRequest,
    ) -> PreloadFlagsResponse:
        await self._prepare_flags_project(request)

        current_version = await self.get_current_version(request.project)

        result = await exec_denormalize_graph(
            graph_engine=self._graph_engine,
            query=load_flags_query(request.project),
            db_engine=self._db_engine,
            session=user_session,
        )
        flags = [Flag(**flag) for flag in result["flags"]]

        return PreloadFlagsResponse(
            flags=flags,
            version=current_version,
        )

    async def sync_flags(self, request: SyncFlagsRequest) -> SyncFlagsResponse:
        current_version = await self.get_current_version(request.project)

        if request.version != current_version:
            result = await exec_denormalize_graph(
                graph_engine=self._graph_engine,
                query=load_flags_query(request.project),
                db_engine=self._db_engine,
                session=user_session,
            )
            flags = [Flag(**flag) for flag in result["flags"]]
        else:
            # Don't load flags if version is the same.
            flags = []

        return SyncFlagsResponse(
            flags=flags,
            version=current_version,
        )
