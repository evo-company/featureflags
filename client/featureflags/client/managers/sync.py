import logging

from datetime import datetime, timedelta

from featureflags.client.flags import AbstractManager, StatsCollector
from featureflags.protobuf.service_pb2_grpc import FeatureFlagsStub

from ..utils import intervals_gen
from ..state import State


log = logging.getLogger(__name__)


class SyncManager(AbstractManager):
    """Feature flags manager for synchronous apps

    Example:

    .. code-block:: python

        from grpc import insecure_channel

        manager = SyncManager(
            'project.name',
            [],  # variables
            insecure_channel('grpc.featureflags.svc:50051'),
        )

    :param project: project name
    :param variables: list of :py:class:`~featureflags.client.flags.Variable`
        definitions
    :param channel: instance of :py:class:`grpc.Channel` class, pointing to the
        feature flags gRPC server
    """
    _exchange_timeout = 5

    def __init__(self, project, variables, channel):
        self._state = State(project, variables)
        self._channel = channel

        self._stats = StatsCollector()
        self._stub = FeatureFlagsStub(channel)

        self._int_gen = intervals_gen()
        self._int_gen.send(None)
        self._next_exchange = datetime.utcnow()

    def preload(self, timeout=None):
        self._exchange(timeout)

    def _exchange(self, timeout):
        request = self._state.get_request(self._stats.flush())
        log.debug('Exchange request, project: %r, version: %r, stats: %r',
                  request.project, request.version, request.flags_usage)
        reply = self._stub.Exchange(request, timeout=timeout)
        log.debug('Exchange reply: %r', reply)
        self._state.apply_reply(reply)

    def get(self, name):
        if datetime.utcnow() >= self._next_exchange:
            try:
                self._exchange(self._exchange_timeout)
            except Exception as exc:
                self._next_exchange = datetime.utcnow() + \
                    timedelta(seconds=self._int_gen.send(False))
                log.error('Failed to exchange: %r, retry after %s',
                          exc, self._next_exchange)
            else:
                self._next_exchange = datetime.utcnow() + \
                    timedelta(seconds=self._int_gen.send(True))
                log.debug('Exchange complete, next will be after %s',
                          self._next_exchange)
        return self._state.get(name)

    def add_trace(self, tracer):
        self._stats.update(tracer.interval, tracer.values)
