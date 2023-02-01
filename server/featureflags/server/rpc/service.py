import time
import asyncio
import logging
import weakref
import contextlib

from sqlalchemy import select
from hiku.engine import Engine
from grpclib.utils import graceful_exit
from grpclib.server import Server
from hiku.readers.protobuf import transform
from hiku.executors.asyncio import AsyncIOExecutor
from grpclib.health.service import Health
from google.protobuf.empty_pb2 import Empty
from grpclib.reflection.service import ServerReflection

from featureflags.protobuf import service_pb2
from featureflags.protobuf.service_grpc import FeatureFlagsBase

from .metrics import track
from .. import metrics
from ..auth import InternalSession
from ..schema import Project
from ..feedback import add_statistics
from ..graph.graph import pull
from ..graph.proto import populate
from ..services.db import get_db

from ..utils import MC, ACC

log = logging.getLogger(__name__)


def debug_cancellation(func):
    async def wrapper(self, stream, *args, **kwargs):
        start_time = time.monotonic()
        try:
            return await func(self, stream, *args, **kwargs)
        except asyncio.CancelledError:
            if stream.deadline:
                deadline = stream.deadline.time_remaining()
                log.warning('Request cancelled, elapsed: %.4fs;'
                            ' remaining: %.4fs',
                            time.monotonic() - start_time, deadline,
                            exc_info=True)
            else:
                log.warning('Request cancelled, elapsed: %.4fs;'
                            ' user-agent: %s;'
                            ' metadata: %s;',
                            time.monotonic() - start_time, stream.user_agent,
                            stream.metadata, exc_info=True)
            raise
    return wrapper


class FeatureFlags(FeatureFlagsBase):
    _store_stats_timeout = 1

    def __init__(self, *, sa_engine, loop):
        self._mc = MC()
        self._acc = ACC()
        self._sa_engine = sa_engine
        self._lock = asyncio.Lock(loop=loop)
        self._engine = Engine(AsyncIOExecutor(loop=loop))

        # debug
        self._tasks = weakref.WeakSet()

    async def exchange(self, stream):
        # backward compatibility
        await self.Exchange(stream)

    @debug_cancellation
    @track
    async def Exchange(self, stream):
        self._tasks.add(asyncio.current_task())
        try:
            request: service_pb2.ExchangeRequest = await stream.recv_message()
        except asyncio.CancelledError:
            h2_conn = stream._stream._h2_connection
            window = h2_conn._inbound_flow_control_window_manager
            log.info(
                'Stuck;'
                ' streams: %d;'
                ' tasks: %d;'
                ' max_window_size: %d;'
                ' current_window_size: %d;'
                ' bytes_processed: %d;'
                ' user_agent: %s;'
                ' metadata: %s;',
                len(h2_conn.streams),
                len(self._tasks),
                window.max_window_size,
                window.current_window_size,
                window._bytes_processed,
                stream.user_agent,
                stream.metadata,
            )
            raise
        async with self._sa_engine.acquire() as db:
            await add_statistics(request, db=db, mc=self._mc, acc=self._acc)
            result = await db.execute(
                select([Project.version])
                .where(Project.name == request.project)
            )
            version = await result.scalar()

        reply = service_pb2.ExchangeReply()
        if request.version != version and request.HasField('query'):
            query = transform(request.query)
            result = await pull(self._engine, query, sa=self._sa_engine,
                                session=InternalSession())
            populate(result, reply.result)
        reply.version = version
        await stream.send_message(reply)
        await stream.send_trailing_metadata()

    async def store_stats(self, stream):
        # backward compatibility
        await self.StoreStats(stream)

    @track
    async def StoreStats(self, stream):
        await stream.send_message(Empty())


def create_server(*, sa_engine, loop):
    ff = FeatureFlags(
        sa_engine=sa_engine,
        loop=loop,
    )
    health = Health()
    handlers = ServerReflection.extend([ff, health])
    return Server(handlers, loop=loop)


async def main(cfg, *, host=None, port=None, prometheus_port=None):
    host = host or '0.0.0.0'
    port = port or 50051

    if prometheus_port:
        metrics.configure(prometheus_port)

    loop = asyncio.get_event_loop()

    async with contextlib.AsyncExitStack() as stack:
        sa_engine = await stack.enter_async_context(get_db(cfg))

        server = create_server(
            sa_engine=sa_engine,
            loop=loop,
        )
        stack.enter_context(graceful_exit([server], loop=loop))
        await server.start(host, port)
        log.info('gRPC server listening on %s:%s', host, port)
        await server.wait_closed()
        log.info('Exiting...')
