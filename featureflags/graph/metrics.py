from collections.abc import Callable

from prometheus_client import Counter, Histogram

from featureflags.metrics import wrap_metric

ACTION_TIME_HISTOGRAM = Histogram(
    "action_time",
    "Action latency (seconds)",
    ["action"],
    buckets=(0.010, 0.050, 0.100, 1.000, float("inf")),
)
ACTION_ERRORS_COUNTER = Counter(
    "action_errors",
    "Action errors count",
    ["action"],
)

GRAPH_PULL_TIME_HISTOGRAM = Histogram(
    "graph_pull_time",
    "Graph pull time (seconds)",
    [],
    buckets=(0.050, 0.100, 0.250, 1, float("inf")),
)

GRAPH_PULL_ERRORS_COUNTER = Counter(
    "graph_pull_errors",
    "Graph pull errors count",
    [],
)


def track(func: Callable) -> Callable:
    func_name = func.__name__
    func = wrap_metric(ACTION_TIME_HISTOGRAM.labels(func_name).time())(func)
    func = wrap_metric(
        ACTION_ERRORS_COUNTER.labels(func_name).count_exceptions()
    )(func)
    return func
