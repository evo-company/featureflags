from strictconf.yaml import init

from featureflags.server.config import Config


def test_local():
    config = Config()
    init(config, ['config.yaml'], 'local')
