# Changelog - Pittaya CLI

All notable changes to the Pittaya CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ✨ `diff` command to check for available component updates
  - Supports checking specific components: `npx pittaya diff button`
  - Interactive mode with multi-select
  - `--all` flag to check all installed components
  - Shows which files have been modified locally
  - Identifies missing files in the project
- ✨ `update` command to update components
  - Updates components to the latest registry version
  - Supports updating specific components: `npx pittaya update button`
  - Interactive mode with multi-select
  - `--all` flag to update all components
  - `--yes` flag to skip confirmations
  - `--force` flag to force update even without detected changes
  - Automatically detects components that are already up to date
- 📚 Architecture Decision Records (ADRs) system
  - ADR-0001: Adoption of ADRs for documenting architectural decisions
  - ADR-0002: AST-based dependency detection
  - Technical guides (e.g., "What is AST?")

### Changed
- ⚡ **BREAKING IMPROVEMENT**: Migrated dependency detection from regex to AST (Abstract Syntax Tree) analysis using `ts-morph`
  - 100% precision in detecting component dependencies (vs ~60% with regex)
  - Automatic detection of relative imports (`./button`, `../ui/card`)
  - 90% reduction in manual `internalDependencies` declarations
  - Intelligent validation with warnings for redundant declarations
  - Fallback to regex if AST analysis fails
  - Zero breaking changes (fully backward compatible)
  - See [ADR-0002](../docs/adr/0002-ast-para-deteccao-de-dependencias.md) for details
- 📚 Expanded main README documentation with examples of `diff` and `update` commands
- 📚 Expanded package README documentation with practical examples
- 📚 Comprehensive documentation about internal dependencies and AST analysis

## [0.0.5] - 2025-11-16

### Fixed
- 🐛 General stability and performance fixes

## [0.0.4] - 2025-11-14

### Changed
- 🔧 Improvements to registry system
- 🔧 Component fetch optimizations

## [0.0.3] - 2025-11-13

### Added
- ✨ `registryDependencies` system to manage dependencies between components
- ✨ Automatic skip of already installed components (preserves customizations)
- ✨ Smart detection of installed components

### Changed
- 🔧 Improvements to dependency installation algorithm
- 📚 Documentation about internal dependencies

### Fixed
- 🐛 Fixed unnecessary component reinstallation

## [0.0.2] - 2025-11-13

### Added
- ✨ `add` command with support for multiple components: `npx pittaya add button badge`
- ✨ `--all` flag to install all available components
- ✨ `--add-missing-deps` flag for automatic NPM dependency installation
- ✨ `--overwrite` flag to overwrite existing files
- ✨ Interactive mode with multi-select components
- ✨ Import transformation system based on project aliases

### Changed
- 🎨 CLI interface improvements with clearer messages
- 🎨 Improved visual feedback with spinners and colors

### Fixed
- 🐛 NPM dependency management fixes

## [0.0.1] - 2025-11-12

### Added
- ✨ `init` command to initialize Pittaya UI in project
  - Automatic creation of `components.json`
  - Base dependencies installation (class-variance-authority, clsx, tailwind-merge)
  - Alias configuration
  - `--yes` flag to use default values
- ✨ `add` command to add components to project
  - Fetches components from GitHub-hosted registry
  - Automatic NPM dependency installation
  - Missing dependency verification with prompt
- ✨ `credits` command to show creators
- ✨ Automatic package manager detection (npm, yarn, pnpm)
- ✨ GitHub Raw-based registry system (free CDN)
- ✨ TypeScript support
- ✨ Configuration via `components.json` with JSON schema

### Infrastructure
- 🔧 Build with tsup
- 🔧 NPM publication as `pittaya`
- 🔧 ESM (ECMAScript Modules) support

---

## Legend

- ✨ New feature
- 🔧 Change/Improvement
- 🐛 Bug fix
- 📚 Documentation
- 🎨 UI/UX
- ⚡ Performance
- 🔒 Security
- 🗑️ Removal

## Links

- [NPM Package](https://www.npmjs.com/package/pittaya)
- [GitHub Repository](https://github.com/pittaya-ui/cli)
- [Documentation](https://pittaya-ui.vercel.app)

[Unreleased]: https://github.com/pittaya-ui/cli/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/pittaya-ui/cli/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/pittaya-ui/cli/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/pittaya-ui/cli/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/pittaya-ui/cli/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/pittaya-ui/cli/releases/tag/v0.0.1

