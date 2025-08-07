Changes in 1.X
==============

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



