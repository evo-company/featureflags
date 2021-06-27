import inspect

from abc import ABC, abstractmethod
from enum import EnumMeta
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from contextlib import contextmanager
from collections import defaultdict, OrderedDict
from collections.abc import Mapping

from google.protobuf.timestamp_pb2 import Timestamp

from featureflags.protobuf.graph_pb2 import Variable as _Variable
from featureflags.protobuf.service_pb2 import FlagUsage


class Variable:
    """Variable definition

    Example:

    .. code-block:: python

        USER_ID = Variable('user.id', Types.STRING)

    :param name: variable's name
    :param type: variable's type, one of :py:class:`Types`
    """
    def __init__(self, name, type):
        self.name = name
        self.type = type


class Types:
    """Enumerates possible variable types, e.g. ``Types.STRING``

    .. py:attribute:: STRING

        String type

    .. py:attribute:: NUMBER

        Number type, represented as ``float`` in Python, ``double`` in ProtoBuf

    .. py:attribute:: TIMESTAMP

        Timestamp type, represented as ``datetime`` in Python,
        ``google.protobuf.Timestamp`` in ProtoBuf

    .. py:attribute:: SET

        Set of strings type

    """
    STRING = _Variable.STRING
    NUMBER = _Variable.NUMBER
    TIMESTAMP = _Variable.TIMESTAMP
    SET = _Variable.SET


class AbstractManager(ABC):

    @abstractmethod
    def get(self, name):
        pass

    @abstractmethod
    def add_trace(self, tracer):
        pass


class StatsCollector:
    """
    Accumulates interval/flag/requests count
    """
    def __init__(self):
        self._acc = defaultdict(lambda: defaultdict(lambda: [0, 0]))

    def update(self, interval, values):
        for name, value in values.items():
            self._acc[interval][name][bool(value)] += 1

    def flush(self, delta=timedelta(minutes=1)):
        now = datetime.utcnow()
        to_flush = [i for i in self._acc if now - i > delta]
        stats = []
        for interval in to_flush:
            acc = self._acc.pop(interval)
            for flag_name, (neg_count, pos_count) in acc.items():
                interval_pb = Timestamp()
                interval_pb.FromDatetime(interval)
                stats.append(FlagUsage(
                    name=flag_name, interval=interval_pb,
                    negative_count=neg_count, positive_count=pos_count,
                ))
        return stats


class Tracer:
    """
    Accumulates request/flag/values
    """
    values = None
    interval = None

    def __enter__(self):
        self.values = OrderedDict()
        self.interval = datetime.utcnow().replace(second=0, microsecond=0)
        return self

    def inc(self, name, value):
        self.values[name] = value

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass


class Flags:
    """Flags object to access current flags' state

    Flag values on this object can't change. So even if flag's state is changed
    during request, your application will see the same value, and only for next
    requests your application will see new value.

    This object is returned from :py:meth:`Client.flags` context manager. No
    need to instantiate it directly.
    """
    def __init__(
        self,
        defaults: Dict[str, bool],
        manager: AbstractManager,
        tracer: Tracer,
        ctx: Optional[Dict[str, Any]] = None,
        overrides: Optional[Dict[str, bool]] = None,
    ):
        self._defaults = defaults
        self._manager = manager
        self._tracer = tracer
        self._ctx = ctx or {}
        self._overrides = overrides or {}

    def __getattr__(self, name: str) -> bool:
        try:
            default = self._defaults[name]
        except KeyError:
            raise AttributeError('Flag {} is not defined'.format(name))
        else:
            try:
                value = self._overrides[name]
            except KeyError:
                check = self._manager.get(name)
                value = check(self._ctx) if check is not None else default
            self._tracer.inc(name, value)
            # caching/snapshotting
            setattr(self, name, value)
            return value

    def __history__(self):
        """Returns an ordered history for flags that were checked"""
        return list(self._tracer.values.items())


class Client:
    """Feature flags client

    :param defaults: flags are defined together with their default values,
        defaults can be provided as dict or class object with attributes
    :param manager: flags manager
    """
    def __init__(self, defaults, manager):
        if isinstance(defaults, EnumMeta):  # deprecated
            defaults = {k: v.value for k, v in defaults.__members__.items()}
        elif inspect.isclass(defaults):
            defaults = {k: getattr(defaults, k) for k in dir(defaults)
                        if k.isupper() and not k.startswith('_')}
        elif not isinstance(defaults, Mapping):
            raise TypeError('Invalid defaults type: {!r}'
                            .format(type(defaults)))

        invalid = [k for k, v in defaults.items()
                   if not isinstance(k, str)
                   or not isinstance(v, bool)]
        if invalid:
            raise TypeError('Invalid flag definition: {}'
                            .format(', '.join(map(repr, invalid))))

        self._defaults = defaults
        self._manager = manager

    @contextmanager
    def flags(
        self,
        ctx: Optional[Dict[str, Any]] = None,
        *,
        overrides: Optional[Dict[str, bool]] = None,
    ):
        """Context manager to wrap your request handling code and get actual
        flags values

        Example:

        .. code-block:: python

            with client.flags() as flags:
                print(flags.FOO_FEATURE)

        :param ctx: current variable values
        :param overrides: flags to override
        :return: :py:class:`Flags` object
        """
        tracer = None
        try:
            with Tracer() as tracer:
                yield Flags(self._defaults, self._manager, tracer, ctx,
                            overrides)
        finally:
            if tracer is not None:
                self._manager.add_trace(tracer)
