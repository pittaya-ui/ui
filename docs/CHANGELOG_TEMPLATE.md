# Changelog Entry Template

Use this template when adding new entries to the changelog.

## For New Features

```markdown
### Added
- ✨ `[name]` command for [feature description]
  - Supports [option 1]
  - Supports [option 2]
  - `--[flag]` flag for [description]
```

## For Changes

```markdown
### Changed
- 🔧 Improvements to [where/what]
- 📚 Expanded documentation with [what was added]
```

## For Bug Fixes

```markdown
### Fixed
- 🐛 Fixed [problem description]
- 🐛 Fix in [where] when [condition]
```

## For Removals

```markdown
### Removed
- 🗑️ Removed [what] (deprecated since [version])
```

## For Deprecations

```markdown
### Deprecated
- ⚠️ [Feature] will be removed in version [X.X.X]
  - Use [alternative] instead
```

## For Security

```markdown
### Security
- 🔒 Fixed vulnerability in [where]
- 🔒 Updated [name] dependency to secure version
```

---

## Complete New Version Example

```markdown
## [0.0.6] - 2025-01-15

### Added
- ✨ `list` command to list installed and available components
  - Supports `--installed` flag to show only installed
  - Supports `--available` flag to show only available
  - `--json` flag for JSON format output
- ✨ `doctor` command for common problem diagnostics
  - Checks `components.json` configuration
  - Validates installed dependencies
  - Checks import consistency

### Changed
- 🔧 Performance improvements to `diff` command
  - Component caching to reduce API calls
  - Parallelized checks
- 📚 Expanded documentation with `list` command examples
- 🎨 Improvements to error message formatting

### Fixed
- 🐛 Fixed parsing of `components.json` with comments
- 🐛 Fixed import transform for Windows paths
- 🐛 Fixed spinner during multiple component installation

### Security
- 🔒 Updated dependencies with known vulnerabilities
```

---

## Tips

### ✅ Best Practices

1. **Be specific**: Describe what changed and the impact
2. **Use examples**: Show commands and flags when relevant
3. **Group related items**: Multiple changes from one feature can be together
4. **Consistent emoji**: Use the project's standard emojis
5. **Useful links**: Reference issues/PRs when applicable

### ❌ Avoid

1. Vague descriptions: "Code changes"
2. Too many technical details: "Refactored parseConfig() to use async/await"
3. Commit messages: "fix", "update", "change"
4. Internal jargon: Variable names, private function names

---

## Project Standard Emojis

- ✨ New feature (`Added`)
- 🔧 Change/Improvement (`Changed`)
- 🐛 Bug fix (`Fixed`)
- 🗑️ Removal (`Removed`)
- ⚠️ Deprecation (`Deprecated`)
- 🔒 Security (`Security`)
- 📚 Documentation
- 🎨 UI/UX
- ⚡ Performance
- 🏗️ Infrastructure

---

## Checklist

When adding a changelog entry:

- [ ] Correct category (Added, Changed, Fixed, etc.)
- [ ] Appropriate emoji
- [ ] Clear and specific description
- [ ] Usage examples (if applicable)
- [ ] Flags and options documented (if applicable)
- [ ] User impact explained
- [ ] Date in YYYY-MM-DD format (when publishing)
- [ ] Comparison links updated (when publishing)
- [ ] Both changelogs updated (`cli/` and `cli/packages/cli/`)
