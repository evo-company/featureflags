import aiopg.sa
from hiku.builder import Q, build
from hiku.engine import Engine
from hiku.query import Node as QueryNode
from sqlalchemy import select

from featureflags.graph.graph import exec_denormalize_graph
from featureflags.http.db import prepare_flags_project
from featureflags.http.types import (
    Flag,
    PreloadFlagsRequest,
    PreloadFlagsResponse,
    SyncFlagsRequest,
    SyncFlagsResponse,
    Value,
)
from featureflags.models import Project
from featureflags.services.auth import user_session
from featureflags.utils import EntityCache, select_scalar


def load_data_query(project: str) -> QueryNode:
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
            Q.values(project_name=project)[
                Q.id,
                Q.name,
                Q.enabled,
                Q.overridden,
                Q.value_default,
                Q.value_override,
                Q.conditions[
                    Q.id,
                    Q.value_override,
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

    async def get_project_version(self, project: str) -> int:
        async with self._db_engine.acquire() as conn:
            return await select_scalar(
                conn,
                select([Project.version]).where(Project.name == project),
            )

    async def prepare_project(
        self,
        request: PreloadFlagsRequest,
    ) -> None:
        """
        Initialize project from request, create/update entities in the database.
        """

        async with self._db_engine.acquire() as conn:
            await prepare_flags_project(
                request,
                conn=conn,
                entity_cache=self._entity_cache,
            )

    async def load(self, request: PreloadFlagsRequest) -> PreloadFlagsResponse:
        """
        Initialize project from request, create/update entities in the database
        and return available flags.
        """

        await self.prepare_project(request)

        current_version = await self.get_project_version(request.project)

        result = await exec_denormalize_graph(
            graph_engine=self._graph_engine,
            query=load_data_query(request.project),
            db_engine=self._db_engine,
            session=user_session.get(),
        )
        flags = [Flag(**flag) for flag in result["flags"]]
        values = [Value(**value) for value in result["values"]]

        return PreloadFlagsResponse(
            flags=flags,
            values=values,
            version=current_version,
        )

    async def sync(self, request: SyncFlagsRequest) -> SyncFlagsResponse:
        """
        Return updated flags if project version
        is different from the requested one.
        """

        current_version = await self.get_project_version(request.project)

        if request.version != current_version:
            result = await exec_denormalize_graph(
                graph_engine=self._graph_engine,
                query=load_data_query(request.project),
                db_engine=self._db_engine,
                session=user_session.get(),
            )
            flags = [Flag(**flag) for flag in result["flags"]]
            values = [Value(**value) for value in result["values"]]
        else:
            # Don't load flags and values if version is the same.
            flags = []
            values = []

        return SyncFlagsResponse(
            flags=flags,
            values=values,
            version=current_version,
        )
