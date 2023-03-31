from featureflags.server.config import Config, load_config


def test_local():
    load_config("config.yaml")
