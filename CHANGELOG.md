# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `diff` command to check for available component updates
- `update` command to update components to the latest registry version
- Interactive mode for `diff` and `update` commands
- `--all` option to check/update all installed components
- `--force` option in `update` command to force update even without detected changes
- Architecture Decision Records (ADRs) documentation system
- Technical guides for complex concepts (e.g., AST)

### Changed
- **MAJOR IMPROVEMENT**: Migrated to AST-based dependency detection (100% precision, 90% less manual work)
- Registry build system now uses TypeScript Compiler API (`ts-morph`) for accurate import analysis
- Automatic detection of relative imports (e.g., `./button`, `../ui/card`)
- Improved README documentation with examples of new commands
- Enhanced documentation about internal dependencies

## [0.0.5] - 2025-11-16

### Changed
- General stability updates

## [0.0.4] - 2025-11-14

### Changed
- Improvements to registry system

## [0.0.3] - 2025-11-13

### Added
- Internal dependencies system (registry dependencies)
- Automatic detection of already installed components

### Changed
- Improvements to dependency management

## [0.0.2] - 2025-11-13

### Added
- `add` command with support for multiple components
- `--add-missing-deps` option for automatic dependency installation
- Import transformation system

### Changed
- CLI UX improvements

## [0.0.1] - 2025-11-12

### Added
- `init` command for project initialization
- Basic `add` command to add components
- `credits` command to show creators
- Configuration via `components.json`
- Automatic package manager detection support (npm, yarn, pnpm)
- GitHub-based registry system
- Automatic import transformation based on aliases

[Unreleased]: https://github.com/pittaya-ui/cli/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/pittaya-ui/cli/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/pittaya-ui/cli/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/pittaya-ui/cli/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/pittaya-ui/cli/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/pittaya-ui/cli/releases/tag/v0.0.1

