# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
