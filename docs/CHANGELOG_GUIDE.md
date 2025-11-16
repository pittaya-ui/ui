# 📝 Changelog Guide

This document describes how to keep the project changelogs up to date.

## 📍 Changelog Locations

The project maintains two changelogs:

1. **`cli/CHANGELOG.md`** - General CLI repository changelog
2. **`cli/packages/cli/CHANGELOG.md`** - Specific NPM package changelog

Both should be kept in sync.

## 🎯 Adopted Standard

We follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) combined with [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Change Categories

- **Added** (✨) - New features
- **Changed** (🔧) - Changes to existing features
- **Deprecated** (⚠️) - Features to be removed
- **Removed** (🗑️) - Removed features
- **Fixed** (🐛) - Bug fixes
- **Security** (🔒) - Vulnerability fixes

### Extra Categories for Organization

- **📚 Documentation** - Documentation changes
- **🎨 UI/UX** - Visual or experience improvements
- **⚡ Performance** - Performance improvements
- **Infrastructure** - Infrastructure changes

## 📖 Workflow

### 1. During Development

When working on a feature/fix, add the entry under **[Unreleased]**:

```markdown
## [Unreleased]

### Added
- ✨ `list` command to list installed components
```

### 2. Before Publishing a New Version

**Step 1:** Move changes from `[Unreleased]` to a new version:

```markdown
## [Unreleased]

## [0.0.6] - 2025-01-15

### Added
- ✨ `list` command to list installed components
```

**Step 2:** Update links at the end of the file:

```markdown
[Unreleased]: https://github.com/pittaya-ui/cli/compare/v0.0.6...HEAD
[0.0.6]: https://github.com/pittaya-ui/cli/compare/v0.0.5...v0.0.6
```

**Step 3:** Update **BOTH** changelogs:
- `cli/CHANGELOG.md`
- `cli/packages/cli/CHANGELOG.md`

### 3. Semantic Versioning

Choose the correct version based on changes:

#### Patch (0.0.X)
- 🐛 Bug fixes
- 📚 Documentation updates
- 🔧 Refactoring without API changes

```bash
npm version patch  # 0.0.5 → 0.0.6
```

#### Minor (0.X.0)
- ✨ New features
- ✨ New commands
- ✨ New options/flags (without breaking compatibility)

```bash
npm version minor  # 0.0.5 → 0.1.0
```

#### Major (X.0.0)
- 💥 Breaking changes
- 🗑️ Feature removals
- 🔧 Incompatible API changes

```bash
npm version major  # 0.0.5 → 1.0.0
```

## ✅ Publishing Checklist

Before publishing a new version:

- [ ] All changes are documented in the changelog
- [ ] Version moved from `[Unreleased]` to `[X.X.X]`
- [ ] Version date updated (format: YYYY-MM-DD)
- [ ] Comparison links updated
- [ ] Both changelogs synchronized (`cli/` and `cli/packages/cli/`)
- [ ] Version in `package.json` updated (`npm version`)
- [ ] Build executed (`npm run build`)
- [ ] Tests passing
- [ ] Commit created: `git commit -m "chore: bump version to X.X.X"`
- [ ] Tag created: `git tag vX.X.X`
- [ ] Push with tags: `git push origin main --tags`
- [ ] Published to NPM: `npm publish`

## 📝 Entry Examples

### Good ✅

```markdown
### Added
- ✨ `list` command to list installed and available components
- ✨ `--installed` flag in `list` command to show only installed
- ✨ `--json` flag for JSON output
```

### Bad ❌

```markdown
### Added
- Added a new thing
- Code change
- Fix
```

## 🔄 Complete Example

```markdown
# Changelog - Pittaya CLI

## [Unreleased]

## [0.0.6] - 2025-01-15

### Added
- ✨ `list` command to list installed and available components
  - Supports `--installed` flag to show only installed
  - Supports `--json` flag for JSON output
- ✨ `doctor` command for problem diagnostics

### Changed
- 🔧 Performance improvements to `diff` command
- 📚 Expanded documentation with `list` command examples

### Fixed
- 🐛 Fixed parsing of `components.json` with comments
- 🐛 Fixed import transform for Windows paths

## [0.0.5] - 2025-01-10

### Added
- ✨ `diff` command to check for updates
- ✨ `update` command to update components

[Unreleased]: https://github.com/pittaya-ui/cli/compare/v0.0.6...HEAD
[0.0.6]: https://github.com/pittaya-ui/cli/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/pittaya-ui/cli/compare/v0.0.4...v0.0.5
```

## 🔗 Resources

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
