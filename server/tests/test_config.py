import os

import yaml
from featureflags.server.config import Config, load_config


def test_local():
    load_config("config.yaml")


def test_from_env():
    os.environ["PGPASS"] = "postgres"
    with open("config.yaml", "r") as f:
        data = yaml.load(f, Loader=yaml.FullLoader)

    del data["postgres"]["password"]
    cfg = Config(**data)
    assert cfg.postgres.password == "postgres"
