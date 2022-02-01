import asyncio
import logging
import warnings

from featureflags.client.flags import StatsCollector, AbstractManager
from featureflags.protobuf.service_grpc import FeatureFlagsStub

from ..utils import intervals_gen
from ..state import State


log = logging.getLogger(__name__)


class AsyncIOManager(AbstractManager):
    """Feature flags manager for asyncio apps

    Example:

    .. code-block:: python

        from grpclib.client import Channel

        manager = AsyncIOManager(
            'project.name',
            [],  # variables
            Channel('grpc.featureflags.svc', 50051)
        )
        try:
            await manager.preload(timeout=5)
        except Exception:
            log.exception('Unable to preload feature flags, application will '
                          'start working with defaults and retry later')
        manager.start()
        try:
            pass  # run your application
        finally:
            manager.close()
            await manager.wait_closed()

    :param project: project name
    :param variables: list of :py:class:`~featureflags.client.flags.Variable`
        definitions
    :param channel: instance of :py:class:`grpclib.client.Channel` class,
        pointing to the feature flags gRPC server
    :param loop: asyncio event loop
    """
    _exchange_task = None
    _exchange_timeout = 5

    def __init__(self, project, variables, channel, *, loop=None):
        self._state = State(project, variables)
        self._channel = channel
        self._loop = loop or asyncio.get_event_loop()

        self._stats = StatsCollector()
        self._stub = FeatureFlagsStub(self._channel)

        self._int_gen = intervals_gen()
        self._int_gen.send(None)

        if loop:
            warnings.warn(
                "The loop arguments is deprecated because it's not necessary.",
                DeprecationWarning,
                stacklevel=2,
            )

    async def preload(self, *, timeout=None):
        await self._exchange(timeout)

    def start(self):
        if self._exchange_task is not None:
            raise RuntimeError('Manager is already started')
        self._exchange_task = self._loop.create_task(self._exchange_coro())

    def close(self):
        self._exchange_task.cancel()

    async def wait_closed(self):
        await asyncio.wait([self._exchange_task], loop=self._loop)
        if self._exchange_task.done():
            try:
                error = self._exchange_task.exception()
            except asyncio.CancelledError:
                pass
            else:
                if error is not None:
                    log.error('Exchange task exited with error: %r', error)

    async def _exchange_coro(self):
        log.info('Exchange task started')
        while True:
            try:
                await self._exchange(self._exchange_timeout)
                interval = self._int_gen.send(True)
                log.debug('Exchange complete, next will be in %ss', interval)
                await asyncio.sleep(interval)
            except asyncio.CancelledError:
                log.info('Exchange task exits')
                break
            except Exception as exc:
                interval = self._int_gen.send(False)
                log.error('Failed to exchange: %r, retry in %ss', exc, interval)
                await asyncio.sleep(interval)
                continue

    async def _exchange(self, timeout):
        request = self._state.get_request(self._stats.flush())
        log.debug('Exchange request, project: %r, version: %r, stats: %r',
                  request.project, request.version, request.flags_usage)
        reply = await self._stub.Exchange(request, timeout=timeout)
        log.debug('Exchange reply: %r', reply)
        self._state.apply_reply(reply)

    def get(self, name):
        return self._state.get(name)

    def add_trace(self, tracer):
        self._stats.update(tracer.interval, tracer.values)
