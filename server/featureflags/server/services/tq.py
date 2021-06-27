from grpclib.client import Channel
from taskqueue.client.queue import QueueStub

from featureflags.protobuf import service_pb2

from ..config import Config


FeatureFlagsQueue = QueueStub.for_(service_pb2, 'FeatureFlags')


def get_tq(cfg: Config, *, loop):
    channel = Channel(cfg.main.taskqueue_host, cfg.main.taskqueue_port,
                      loop=loop)
    return FeatureFlagsQueue(cfg.main.known_as, channel)
