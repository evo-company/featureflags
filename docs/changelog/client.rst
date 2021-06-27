Client
======

0.2.0
~~~~~

  - Fixed default flag value
  - Removed ``OverrideManager`` in favor to the ``overrides`` keyword argument
    in the :py:meth:`~featureflags.client.flags.Client.flags` method.
  - Dropped Python 2 support

0.1.3
~~~~~

  - Added :py:meth:`~featureflags.client.flags.Flags.__history__` method,
    see :doc:`../client/tracing` for more information

0.1.2
~~~~~

  - Added :py:class:`~featureflags.client.managers.dummy.DummyManager`
  - Added :py:class:`~featureflags.client.managers.override.OverrideManager`
    to override flags state
  - Fixed setup.py file to properly list all requirements
