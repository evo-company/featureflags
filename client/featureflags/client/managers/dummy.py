from featureflags.client.flags import AbstractManager


class DummyManager(AbstractManager):
    """Dummy feature flags manager

    It can be helpful when you want to use flags with their default values.

    Example:

    .. code-block:: python

        class Defaults:
            FOO_FEATURE = False

        client = Client(Defaults, DummyManager())

        with client.flags() as flags:
            assert flags.FOO_FEATURE is False

    """
    def get(self, name):
        return None

    def add_trace(self, tracer):
        pass
