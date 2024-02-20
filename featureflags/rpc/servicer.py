import asyncio
import logging
import weakref

import aiopg.sa
from google.protobuf.empty_pb2 import Empty
from grpclib.server import Stream
from hiku.engine import Engine
from hiku.readers import protobuf
from sqlalchemy import select

from featureflags.graph.graph import exec_graph
from featureflags.graph.proto_adapter import populate_result_proto
from featureflags.models import Project
from featureflags.protobuf import service_grpc, service_pb2
from featureflags.rpc.db import add_statistics
from featureflags.rpc.metrics import track
from featureflags.rpc.utils import debug_cancellation
from featureflags.services.auth import (
    user_session,
)
from featureflags.utils import EntityCache, FlagAggStats, select_scalar

log = logging.getLogger(__name__)


class FeatureFlagsServicer(service_grpc.FeatureFlagsBase):
    def __init__(
        self,
        db_engine: aiopg.sa.Engine,
        graph_engine: Engine,
    ) -> None:
        self._entity_cache = EntityCache()
        self._flag_agg_stats = FlagAggStats()
        self._graph_engine = graph_engine
        self._db_engine = db_engine

        # for debugging
        self._tasks = weakref.WeakSet()  # type: ignore

    async def exchange(self, stream: Stream) -> None:
        # backward compatibility
        await self.Exchange(stream)

    @debug_cancellation
    @track
    async def Exchange(self, stream: Stream) -> None:  # noqa: N802
        self._tasks.add(asyncio.current_task())
        try:
            request: service_pb2.ExchangeRequest = await stream.recv_message()
        except asyncio.CancelledError:
            h2_conn = stream._stream._h2_connection
            window = h2_conn._inbound_flow_control_window_manager
            log.info(
                "Stuck;"
                " streams: %d;"
                " tasks: %d;"
                " max_window_size: %d;"
                " current_window_size: %d;"
                " bytes_processed: %d;"
                " user_agent: %s;"
                " metadata: %s;",
                len(h2_conn.streams),
                len(self._tasks),
                window.max_window_size,
                window.current_window_size,
                window._bytes_processed,
                stream.user_agent,
                stream.metadata,
            )
            raise

        async with self._db_engine.acquire() as conn:
            await add_statistics(
                request,
                conn=conn,
                entity_cache=self._entity_cache,
                flag_agg_stats=self._flag_agg_stats,
            )
            version = await select_scalar(
                conn,
                select([Project.version]).where(
                    Project.name == request.project
                ),
            )

        exchange_reply = service_pb2.ExchangeReply()

        if request.version != version and request.HasField("query"):
            result = await exec_graph(
                graph_engine=self._graph_engine,
                query=protobuf.transform(request.query),
                db_engine=self._db_engine,
                session=user_session.get(),
            )
            populate_result_proto(result, exchange_reply.result)

        exchange_reply.version = version

        await stream.send_message(exchange_reply)
        await stream.send_trailing_metadata()

    async def store_stats(self, stream: Stream) -> None:
        # backward compatibility
        await self.StoreStats(stream)

    @track
    async def StoreStats(self, stream: Stream) -> None:  # noqa: N802
        await stream.send_message(Empty())
