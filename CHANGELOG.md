# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Slack notifications**: flag and value changes are posted to Slack via
  incoming webhooks. Notification channels (name + webhook URL) are managed
  on a new global settings page (gear icon in the sidebar) and selected
  per-project in project settings. Delivery is best-effort and async;
  sends are counted in the `slack_notifications_total` Prometheus metric and
  failures in `slack_notification_errors_total` (both labelled by `channel`).
- **Readonly replica mode**: new `readonly` config option. When enabled, the
  `http` server skips all client-triggered DB writes (flag registration,
  report timestamps) so the server can run against a readonly Postgres
  replica in a second datacenter. Unknown projects are served as an empty
  state with `version: 0` instead of failing.

### Fixed
- **UI**: Redirect to the root page right after a project is deleted ([#61](https://github.com/evo-company/featureflags/issues/61)). The projects list is refreshed via Apollo cache instead of a delayed full page reload, and the deleted project is cleared from the selection state.

### Removed
- **gRPC Server**: Removed the gRPC server, protobuf definitions and related dependencies; the gRPC API is superseded by the HTTP API
  - Removed `featureflags/rpc/` (server, servicer, container, db sync, metrics) and the `rpc` CLI command
  - Removed `featureflags/protobuf/` (`.proto` files and generated modules) and `graph/proto_adapter.py`
  - Removed `grpclib`, `grpcio`, `protobuf` and `types-protobuf` dependencies
  - Removed the `rpc` service from docker-compose, `grpc_health_probe` from the Dockerfile, rpc config sections and gRPC docs

### Internal
- Release workflow now creates a GitHub Release for each pushed `v*` tag, with notes taken from the matching `CHANGELOG.md` section (auto-generated when missing) and pre-release marking for non-final versions

## [1.26.0rc3] - 2026-06-10

### Added
- **Flag State Metric**: New Prometheus gauge `flag_state` with `flag` and `project` labels, set to 1/0 whenever a flag is enabled or disabled

## [1.26.0rc2] - 2026-05-21

### Added
- **Env Var Substitution in Config**: Support resolving config values from environment variables
  - OIDC `client_secret` can be resolved from an env var via `$VAR` indirection
  - Support for `${VAR}` and inline env-var substitution; invalid env var names pass through unchanged

## [1.26.0rc1] - 2026-05-21

### Added
- **OIDC Authentication**: New OpenID Connect authentication support
  - New `featureflags/services/oidc_auth.py` service and `/oidc` web API endpoints
  - `oidc_subject` column added to auth user (database migration included)
  - UI login flow updated to support OIDC

## [1.25.0] - 2026-01-09

### Added
- **Project Label in Metrics**: Added `project` label to gRPC and HTTP handler metrics to distinguish between projects
- **Prometheus Metrics Documentation**: New documentation page describing exposed Prometheus metrics

### Internal
- Restructured and updated documentation
- Updated pdm and lock file

## [1.24.4] - 2025-10-10

### Fixed
- **Value Condition Override Input**: Made value condition override input single per condition
  - Fixed bug with editing an existing condition (order of `disable_condition` and `add_condition` operations)
  - Fixed bug with the position of the first condition in the list
  - Improved inputs layout with Flex

## [1.24.3] - 2025-10-10

### Internal
- Updated README

## [1.24.2] - 2025-10-10

### Changed
- **UI Improvements**: Improved conditions ordering in the UI and made the layout wider

### Fixed
- Fixed GraphiQL

### Internal
- Updated getting started docs and added code comments

## [1.24.1] - 2025-08-11

### Internal
- **Documentation**: Added RST documentation with Read the Docs config and UI image

## [1.24.0] - 2025-07-29

### Added
- **Version Display Feature**: Added version display in the UI footer
  - Server version from `featureflags.__version__`
  - Build version from `featureflags.__build_version__` (which is taken from `BUILD_VERSION` environment variable)
- **GraphQL Version API**: New GraphQL field `version` for version information
  - `version` query returns `Version` node with `serverVersion` and `buildVersion` fields

### Internal
- **Cross-platform Release Script**: Fixed release script compatibility
  - Added macOS (BSD sed) and Linux (GNU sed) compatibility
  - Fixed `sed -i` command for cross-platform deployment

## [1.22.0] - Previous Release

Initial release with core feature flags functionality.
