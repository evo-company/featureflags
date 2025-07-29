# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.23.0] - 2025-01-13

### Added
- **Version Display Feature**: Added dual version display in the UI footer
  - Server version from `featureflags.__version__`
  - Build version (placeholder for future `logevo.get_version()` integration)
  - Displays as "v1.23.0 (build: 1.23.0)" in bottom right corner
  - Extracted into reusable `Version` React component
- **GraphQL Version API**: New GraphQL endpoint for version information
  - `version` query returns `Version` node with `serverVersion` and `buildVersion` fields
  - Uses `VersionInfo` dataclass for type-safe version data handling
  - Integrated with existing GraphQL schema
- **Cross-platform Release Script**: Fixed release script compatibility
  - Added macOS (BSD sed) and Linux (GNU sed) compatibility
  - Fixed `sed -i` command for cross-platform deployment

### Changed
- **Backend Architecture**: Improved version handling with dataclass
  - Replaced list-based version data with `VersionInfo` dataclass
  - Enhanced type safety and code maintainability
  - Better separation of concerns between server and build versions

### Technical Details
- **Frontend**: React component with Apollo Client GraphQL integration
- **Backend**: GraphQL schema with frozen dataclass for immutability
- **Build System**: Cross-platform release script with proper sed commands
- **Type Safety**: Full TypeScript/GraphQL type definitions

### Future Enhancements
- Ready for `logevo.get_version()` integration when available
- Extensible dataclass structure for additional version fields
- Modular component design for easy UI customization

---

## [1.22.0] - Previous Release

Initial release with core feature flags functionality.
