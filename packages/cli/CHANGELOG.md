# Changelog - Pittaya CLI

All notable changes to the Pittaya CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.8] - 2025-12-02

### Added
- ✨ Automatic directory structure detection (`src/` vs root)
  - CLI now automatically detects if the project uses `src/` directory or root-level structure
  - `init` command suggests correct paths based on detected structure
  - Components installed with correct imports regardless of structure
  - Checks for common directories (`app/`, `components/`, `lib/`) inside `src/`
  - Validates `tsconfig.json` configuration to confirm structure
  - Zero manual configuration required
  - See [SRC_DIRECTORY_DETECTION.md](../docs/SRC_DIRECTORY_DETECTION.md) for details
- ✨ Dependency validation system for registry components
  - New `validate:deps` script to check for missing NPM dependencies
  - Automated detection of external package imports in component code
  - Prevents installation errors caused by undeclared dependencies
  - Supports scoped packages (`@radix-ui/react-slot`) and sub-paths
  - Clear error reporting showing declared vs detected vs missing dependencies
  - CI/CD integration ready
  - See [DEPENDENCY_VALIDATION.md](../docs/DEPENDENCY_VALIDATION.md) for details

### Changed
- 🔧 `resolveTargetPath()` function migrated to async to support dynamic detection
  - Removes hardcoded `.replace("@/", "src/")` that always assumed `src/` structure
  - Now uses `resolveAliasPath()` to resolve paths dynamically
  - Affects `add`, `diff`, `update`, and `list` commands
- 🔧 `init` command now uses `getDefaultPaths()` to suggest intelligent defaults
  - Defaults automatically adjusted: `src/app/globals.css` vs `app/globals.css`
  - Improves user experience when initializing projects
- 🔧 `build:registry` script now automatically validates dependencies after building
  - Auto-detection now always runs (merges with manual declarations)
  - Previously manual declarations would override auto-detection
  - Validation runs automatically, warns about missing dependencies

### Fixed
- 🐛 Fixed bug where components were installed in `src/` even in projects with root-level structure
- 🐛 Fixed incorrect imports (`@/lib/utils` → `src/lib/utils`) in projects without `src/` directory
- 🐛 Fixed missing NPM dependencies in registry components
  - `button`: Added `class-variance-authority`
  - `installation-section`: Added `lucide-react` and `sonner`
  - All components now properly declare their dependencies

## [0.0.7] - 2025-11-28

### Added
- ✨ `list` command to list available and installed components
  - Shows all components from the registry with installation status
  - `--installed` flag to show only installed components
  - `--available` flag to show only available components
  - `--json` flag for JSON output format
  - Grouped by category with descriptions
  - Shows dependency information (npm deps and internal deps)
  - Visual indicators for installed vs available components

### Changed
- 🔧 Refactored `isComponentInstalled` and `resolveTargetPath` to shared utility functions
  - Extracted to `utils/component-checker.ts` to avoid code duplication
  - Now used by `add`, `diff`, `update`, and `list` commands
  - Improved maintainability and consistency
- 📚 Expanded README documentation with examples of `list` command

## [0.0.6] - 2025-11-16

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

