# 🗺️ Pittaya CLI - Roadmap

This document outlines the development roadmap for Pittaya CLI, including completed features and planned enhancements.

**Last Updated:** November 28, 2025
**Current Version:** 0.0.7

---

## ✅ Completed (v0.0.1 - v0.0.5)

### Core Commands

- ✅ **`init` command** - Project initialization with components.json setup
- ✅ **`add` command** - Component installation with dependency management
- ✅ **`diff` command** - Check for component updates (v0.0.6)
- ✅ **`update` command** - Update components to latest version (v0.0.6)
- ✅ **`list` command** - List available and installed components (v0.0.7)
- ✅ **`credits` command** - Show creators and contributors

### Dependency Management

- ✅ **Automatic package manager detection** (npm, yarn, pnpm)
- ✅ **NPM dependency installation** with prompts
- ✅ **Registry dependencies** (internal component dependencies)
- ✅ **`--add-missing-deps` flag** for automatic dependency installation
- ✅ **Smart skip of installed components** - Preserves customizations

### Advanced Features

- ✅ **AST-based dependency detection** using ts-morph
  - 100% precision in detecting component dependencies
  - Automatic detection of relative imports (`./button`, `../ui/card`)
  - 90% reduction in manual `internalDependencies` declarations
  - Intelligent validation with warnings for redundant declarations
- ✅ **Import transformation system** based on project aliases
- ✅ **Interactive mode** for component selection (multi-select)
- ✅ **GitHub-based registry** (free CDN via Raw URLs)

### Developer Experience

- ✅ **Component customization workflow** - Safe reinstallation
- ✅ **Force reinstallation** with `--overwrite` flag
- ✅ **Interactive prompts** with confirmation dialogs
- ✅ **Colored output** and loading spinners
- ✅ **Comprehensive error messages**

### Documentation

- ✅ **Complete README** with examples and use cases
- ✅ **Changelog system** following Keep a Changelog standard
- ✅ **Architecture Decision Records (ADRs)** system
  - ADR-0001: Adoption of ADRs
  - ADR-0002: AST-based dependency detection
- ✅ **Technical guides** (e.g., "What is AST?")
- ✅ **Internal dependencies guide**
- ✅ **Skip installed components guide**
- ✅ **Publishing guide** for maintainers
- ✅ **Contributing guide**

---

## 📋 Planned Features

### Phase 1: Diagnostics & Management (v0.2.0)

#### 2. `doctor` Command

Diagnose common problems and configuration issues.

**Features:**

- Validate `components.json` configuration
- Check installed dependencies
- Verify import consistency
- Check Tailwind CSS configuration
- Validate path aliases
- Suggest fixes for common issues

**Usage:**

```bash
npx pittaya doctor
```

**Status:** 🔵 Planned (v0.2.0)
**Priority:** High
**Complexity:** High
**Dependencies:** None

---

#### 3. `remove` Command

Remove installed components with dependency warnings.

**Features:**

- Remove component files
- Check for dependents before removal
- Warn if other components depend on it
- `--force` flag to ignore warnings
- Dry run mode (`--dry-run`)

**Usage:**

```bash
npx pittaya remove button
npx pittaya remove button --force
```

**Status:** 🔵 Planned (v0.2.0)
**Priority:** High
**Complexity:** Medium
**Dependencies:** None

---

### Phase 2: Version Control & Search (v0.3.0)

#### 4. Component Version Tracking

Track component versions for better update management.

**Features:**

- Store component version in metadata
- Show version in `list` command
- Compare versions in `diff` command
- Version history and changelog per component

**Status:** 🔵 Planned (v0.3.0)
**Priority:** High
**Complexity:** High
**Dependencies:** Registry schema update

---

#### 5. `search` Command

Search for components in the registry.

**Features:**

- Search by name
- Search by category
- Search by tags/keywords
- Fuzzy matching
- Rich output with descriptions

**Usage:**

```bash
npx pittaya search button
npx pittaya search --category actions
```

**Status:** 🔵 Planned (v0.3.0)
**Priority:** Medium
**Complexity:** Low
**Dependencies:** None

---

### Phase 3: Theming & Templates (v0.4.0)

#### 6. Theme Management

Manage color themes and styling variables.

**Features:**

- List available themes
- Switch between themes
- Customize colors
- Export/import theme configurations
- Preview themes

**Usage:**

```bash
npx pittaya theme
npx pittaya theme set dark
npx pittaya theme customize
```

**Status:** 🔵 Planned (v0.4.0)
**Priority:** Medium
**Complexity:** High
**Dependencies:** Theme system design

---

#### 7. Component Templates

Generate custom component templates.

**Features:**

- Create component from template
- Custom templates support
- Interactive scaffolding
- Best practices included

**Usage:**

```bash
npx pittaya generate button-variant
npx pittaya generate --template custom
```

**Status:** 🔵 Planned (v0.4.0)
**Priority:** Medium
**Complexity:** Medium
**Dependencies:** Template system design

---

### Phase 4: Ecosystem & Integrations (v1.0.0+)

#### 8. Plugin System

Allow community plugins to extend CLI functionality.

**Features:**

- Plugin API
- Plugin discovery
- Plugin installation
- Plugin configuration

**Status:** 🔵 Planned (v1.0.0)
**Priority:** Medium
**Complexity:** Very High
**Dependencies:** Architecture redesign

---

#### 9. CI/CD Integration

Tools for continuous integration workflows.

**Features:**

- Check for outdated components in CI
- Automated update PRs
- Component audit reports
- Version pinning

**Usage:**

```bash
npx pittaya audit
npx pittaya outdated --json
```

**Status:** 🔵 Planned (v1.0.0)
**Priority:** Medium
**Complexity:** Medium
**Dependencies:** None

---

#### 10. Web Dashboard

Web interface for component management.

**Features:**

- Visual component browser
- One-click installation
- Visual diff viewer
- Configuration editor
- Usage statistics

**Status:** 🔵 Planned (v1.1.0+)
**Priority:** Low
**Complexity:** Very High
**Dependencies:** Web app development

---

## 🎯 Priority Matrix

| Priority           | Features                                                | Target Release  |
| ------------------ | ------------------------------------------------------- | --------------- |
| **Critical** | Stability, Bug fixes                                    | v0.1.0          |
| **High**     | `list`, `doctor`, `remove`                        | v0.0.6 - v0.2.0 |
| **Medium**   | Version Tracking,`search`, Themes, Templates, Testing | v0.3.0 - v0.5.0 |
| **Low**      | Plugins, CI/CD, Dashboard, Advanced features            | v1.0.0+         |

---

## 🔄 Release Schedule

### v0.0.6 (Current) - Component Updates

**Target:** November 2025

- ✅ `diff` command
- ✅ `update` command
- ✅ AST-based dependency detection
- ✅ ADR system
- 🟡 `list` command

### v0.1.0 - First Stable Release 🎉

**Target:** Q2 December 2025

- ✅ Production-ready
- ✅ Core commands stable (`init`, `add`, `diff`, `update`, `list`)
- ✅ AST-based dependency detection
- ✅ Comprehensive documentation
- ✅ Tested and reliable
- Bug fixes and stability improvements

### v0.2.0 - Diagnostics & Management

**Target:** Q1 2026

- `doctor` command - Project diagnostics
- `remove` command - Component removal
- Enhanced error messages
- Performance optimizations

### v0.3.0 - Version Control & Search

**Target:** Q2 2026

- Component version tracking
- `search` command
- Component changelog per component
- Registry improvements

### v0.4.0 - Theming & Templates

**Target:** Q3 2026

- Theme management system
- Component templates
- Custom scaffolding
- Enhanced customization

### v0.5.0 - Testing & Quality

**Target:** Q3 2026

- Full test coverage (>80%)
- E2E test suite
- Performance benchmarks
- Security audits

### v1.0.0 - Major Stable Release 🚀

**Target:** Q4 2026

- Complete and mature feature set
- Stable API (semver commitment)
- Full backward compatibility
- Enterprise-ready
- Plugin system foundation
- CI/CD integration tools
- Production battle-tested
- Full test coverage (>90%)

---

## 💡 Community Requests

This section tracks feature requests from the community. If you'd like to suggest a feature:

1. Open an issue on [GitHub](https://github.com/pittaya-ui/cli/issues)
2. Use the "Feature Request" template
3. Describe the use case and expected behavior

### Top Requested Features

- 🔥 `list` command (10 votes)
- 🔥 `doctor` command (8 votes)
- 🔥 Theme management (6 votes)
- Component search (4 votes)
- Backup/restore components (3 votes)

---

## 🚀 Performance Goals

### Current Benchmarks (v0.0.5)

- Registry fetch: ~200ms
- Component installation: ~1-2s per component
- AST analysis: ~50-100ms per file

### Target Benchmarks (v1.0.0)

- Registry fetch: <100ms (caching)
- Component installation: <500ms per component
- AST analysis: <50ms per file
- Full `diff` check: <3s for 20 components

---

## 🧪 Testing Goals

### Current Coverage (v0.0.5)

- Core commands: Manual testing
- Registry system: Manual testing
- AST detection: Manual testing

### v0.1.0 Goals (First Stable - December 2025)

- Core functionality: Thoroughly tested manually
- Critical paths: Integration tests
- Documentation: Complete and accurate

### v0.2.0 Goals (Q1 2026)

- Unit tests: Core utilities (>40% coverage)
- Integration tests: Main commands
- CI/CD: Automated testing pipeline

### v0.5.0 Goals (Q3 2026)

- Unit tests: >80% coverage
- Integration tests: All commands
- E2E tests: Critical workflows
- Performance tests: Key operations

### v1.0.0 Goals (Q4 2026)

- Full test coverage: >90%
- Security audits: Complete
- Performance benchmarks: Established
- Stress testing: Production-ready
- API stability commitment (semver)

---

## 📊 Success Metrics

### Adoption

- ✅ 10+ NPM downloads/week (Current - v0.0.5)
- 🎯 50+ NPM downloads/week (v0.0.6)
- 🎯 100+ NPM downloads/week (v0.1.0 - First Stable)
- 🎯 300+ NPM downloads/week (v0.3.0)
- 🎯 500+ NPM downloads/week (v0.5.0)
- 🎯 1,000+ NPM downloads/week (v1.0.0)

### Quality

- ✅ Zero critical bugs (Current)
- 🎯 <5 open bugs (v0.1.0)
- 🎯 60% test coverage (v0.2.0)
- 🎯 80% test coverage (v0.5.0)
- 🎯 >90% user satisfaction (v1.0.0)

### Developer Experience

- ✅ Comprehensive docs (Current)
- 🎯 Video tutorials (v0.3.0)
- 🎯 Complete API documentation (v0.5.0)
- 🎯 Interactive playground (v1.0.0)

---

## 🤝 Contributing

Want to help implement a feature? Check out:

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [GitHub Issues](https://github.com/pittaya-ui/cli/issues) - Open issues
- [GitHub Projects](https://github.com/pittaya-ui/cli/projects) - Project board

---

## 📝 Notes

- **Legend:**

  - ✅ Completed
  - 🟡 In Progress
  - 🔵 Planned
  - 🔥 High Demand
- **Priority Levels:**

  - Critical: Blocking issues or security vulnerabilities
  - High: Core functionality needed by most users
  - Medium: Nice-to-have features that improve UX
  - Low: Future enhancements or edge cases
- **Complexity Levels:**

  - Low: <1 week development time
  - Medium: 1-2 weeks development time
  - High: 2-4 weeks development time
  - Very High: 1+ month development time

---

**Last Updated:** November 16, 2025
**Maintained by:** Pittaya UI Team
**Feedback:** [GitHub Discussions](https://github.com/pittaya-ui/cli/discussions)
