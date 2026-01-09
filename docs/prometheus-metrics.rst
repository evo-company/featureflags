=====================
Prometheus Metrics
=====================

The featureflags server exposes Prometheus metrics that can be used to monitor the health and performance of the service.

HTTP Metrics
------------

.. describe:: http_request_total_per_project

   Total number of HTTP requests.

   :labels:
      - ``handler`` (string) - HTTP request handler (e.g. ``/load``, ``/sync``)
      - ``project`` (string) - Project name

gRPC Metrics
------------

.. describe:: grpc_method_time_seconds

   Time spent in gRPC methods.

   :labels:
      - ``method`` (string) - gRPC method name

.. describe:: grpc_method_call_count

   How many times gRPC method was called.

   :labels:
      - ``method`` (string) - gRPC method name
      - ``project`` (string) - Project name

.. describe:: grpc_method_call_in_progress

   How many gRPC method calls are in progress.

   :labels:
      - ``method`` (string) - gRPC method name

Graph Metrics
-------------

.. describe:: action_time

   Action latency.

   :labels:
      - ``action`` (string) - Action name

.. describe:: action_errors

   Action errors count.

   :labels:
      - ``action`` (string) - Action name

.. describe:: graph_pull_time

   Graph pull time.

.. describe:: graph_pull_errors

   Graph pull errors count.