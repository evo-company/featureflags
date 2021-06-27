import pytest

from featureflags.client.flags import AbstractManager
from featureflags.client.conditions import load_flags


class SimpleManager(AbstractManager):

    def __init__(self):
        self.checks = {}

    def load(self, result):
        self.checks = load_flags(result)

    def get(self, name):
        return self.checks.get(name)

    def add_trace(self, tracer):
        pass


@pytest.fixture()
def loop(event_loop):
    return event_loop


@pytest.fixture()
def manager():
    return SimpleManager()
