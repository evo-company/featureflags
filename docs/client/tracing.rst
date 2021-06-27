Tracing
=======

When using lots of feature flags in a complex application, sometimes it is
useful to know which flags were checked during request handling, to better
understand application's behaviour.

Feature flags gives this ability, that's why we are using context manager
before we get actual :py:class:`~featureflags.client.flags.Flags` object.
In order to get a list of used flags in order they were used use
:py:meth:`~featureflags.client.flags.Flags.__history__` method:

.. code-block:: python

    with client.flags() as flags:
        if flags.FOO_FEATURE:
            pass

    assert flags.__history__() == [
        ('FOO_FEATURE', True),
    ]

Then you can log this information, show it or send somewhere.
