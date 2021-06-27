FF_PROJECT = 'test.test'

FF_HOST = 'grpc.featureflags.svc'
FF_PORT = 50051

try:
    from local_config import *  # noqa
except ImportError:
    pass
