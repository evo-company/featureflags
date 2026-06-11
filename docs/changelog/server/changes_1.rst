Changes in 1.X
==============

Unreleased
----------

Removed
~~~~~~~

- **gRPC Server**: Removed the gRPC server, protobuf definitions and related dependencies; the gRPC API is superseded by the HTTP API
  - Removed ``featureflags/rpc/`` (server, servicer, container, db sync, metrics) and the ``rpc`` CLI command
  - Removed ``featureflags/protobuf/`` (``.proto`` files and generated modules) and ``graph/proto_adapter.py``
  - Removed ``grpclib``, ``grpcio``, ``protobuf`` and ``types-protobuf`` dependencies
  - Removed the ``rpc`` service from docker-compose, ``grpc_health_probe`` from the Dockerfile, rpc config sections and gRPC docs

1.26.0rc3
---------

Added
~~~~~

- **Flag State Metric**: New Prometheus gauge ``flag_state`` with ``flag`` and ``project`` labels, set to 1/0 whenever a flag is enabled or disabled

1.26.0rc2
---------

Added
~~~~~

- **Env Var Substitution in Config**: Support resolving config values from environment variables
  - OIDC ``client_secret`` can be resolved from an env var via ``$VAR`` indirection
  - Support for ``${VAR}`` and inline env-var substitution; invalid env var names pass through unchanged

1.26.0rc1
---------

Added
~~~~~

- **OIDC Authentication**: New OpenID Connect authentication support
  - New ``featureflags/services/oidc_auth.py`` service and ``/oidc`` web API endpoints
  - ``oidc_subject`` column added to auth user (database migration included)
  - UI login flow updated to support OIDC

1.25.0
------

Added
~~~~~

- **Project Label in Metrics**: Added ``project`` label to gRPC and HTTP handler metrics to distinguish between projects
- **Prometheus Metrics Documentation**: New documentation page describing exposed Prometheus metrics

Internal
~~~~~~~~

- Restructured and updated documentation
- Updated pdm and lock file

1.24.4
------

Fixed
~~~~~

- **Value Condition Override Input**: Made value condition override input single per condition
  - Fixed bug with editing an existing condition (order of ``disable_condition`` and ``add_condition`` operations)
  - Fixed bug with the position of the first condition in the list
  - Improved inputs layout with Flex

1.24.3
------

Internal
~~~~~~~~

- Updated README

1.24.2
------

Changed
~~~~~~~

- **UI Improvements**: Improved conditions ordering in the UI and made the layout wider

Fixed
~~~~~

- Fixed GraphiQL

Internal
~~~~~~~~

- Updated getting started docs and added code comments

1.24.1
------

Internal
~~~~~~~~

- **Documentation**: Added RST documentation with Read the Docs config and UI image

1.24.0
------

Added
~~~~~

- **Version Display Feature**: Added version display in the UI footer
  - Server version from ``featureflags.__version__``
  - Build version from ``featureflags.__build_version__`` (which is taken from ``BUILD_VERSION`` environment variable)
- **GraphQL Version API**: New GraphQL field ``version`` for version information
  - ``version`` query returns ``Version`` node with ``serverVersion`` and ``buildVersion`` fields

Internal
~~~~~~~~

- **Cross-platform Release Script**: Fixed release script compatibility
  - Added macOS (BSD sed) and Linux (GNU sed) compatibility
  - Fixed ``sed -i`` command for cross-platform deployment

1.22.0
------

Initial release with core feature flags functionality.



