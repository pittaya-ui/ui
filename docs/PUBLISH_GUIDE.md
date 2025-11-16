## 📦 Publishing Guide (For Maintainers)

### Prerequisites

1. **NPM Account:** Create at https://www.npmjs.com/signup
2. **2FA Recommended:** Enable two-factor authentication for security

### Publishing Steps

#### 1. Verify Package Name Availability

```bash
npm search pittaya
```

**If name is taken, alternatives:**
- `@pittaya-ui/cli`
- `pittaya-ui-cli`
- Another creative name

#### 2. NPM Login

```bash
npm login
# Enter: username, password, email, OTP (if enabled)

# Verify login
npm whoami
```

#### 3. Update Changelog

Before publishing, update the changelog:

```bash
# 1. Move changes from [Unreleased] to new version
# 2. Update both changelogs:
#    - cli/CHANGELOG.md
#    - cli/packages/cli/CHANGELOG.md
# 3. Add the date (YYYY-MM-DD)
# 4. Update comparison links

# Example:
## [0.0.6] - 2025-01-15

### Added
- ✨ `diff` command to check for updates
- ✨ `update` command to update components
```

> 📖 **See:** [CHANGELOG_GUIDE.md](./docs/CHANGELOG_GUIDE.md) for details

#### 4. Update Version

```bash
cd packages/cli

# Choose the version type:

# Patch (0.0.X) - Bug fixes, docs
npm version patch

# Minor (0.X.0) - New features
npm version minor

# Major (X.0.0) - Breaking changes
npm version major
```

#### 5. Build and Publish

```bash
cd packages/cli

# Build the CLI
npm run build

# Publish to NPM
npm run pub:release

# Or manually:
# npm publish --access public
```

#### 6. Commit and Tag

```bash
cd ../..  # Back to project root

# Commit changes
git add .
git commit -m "chore: bump version to X.X.X"

# Create tag
git tag vX.X.X

# Push with tags
git push origin main --tags
```

### ✅ Complete Publishing Checklist

Before publishing, make sure:

- [ ] 📝 Changelog updated (both: `cli/CHANGELOG.md` and `cli/packages/cli/CHANGELOG.md`)
- [ ] 📅 Version date added to changelog
- [ ] 🔗 Comparison links updated in changelog
- [ ] 📦 Version in `package.json` updated (`npm version`)
- [ ] 🔨 Build executed successfully (`npm run build`)
- [ ] ✅ Code working (local test with `npx .`)
- [ ] 📚 README updated (if necessary)
- [ ] 🐛 No linter errors
- [ ] 💾 Commit created: `git commit -m "chore: bump version to X.X.X"`
- [ ] 🏷️ Tag created: `git tag vX.X.X`
- [ ] ⬆️ Push with tags: `git push origin main --tags`
- [ ] 📤 Published to NPM: `npm publish`
- [ ] ✅ Verified on NPM: https://www.npmjs.com/package/pittaya

### 🧪 Testing Before Publishing

```bash
# Test locally
cd packages/cli
npm run build
npx .

# Or link globally
npm link
pittaya --help

# When finished
npm unlink -g pittaya
```

### 📋 Summarized Workflow

```bash
# 1. Update changelogs
# 2. Version
cd packages/cli
npm version minor  # or patch/major

# 3. Build
npm run build

# 4. Test
npx . --help

# 5. Publish
npm run pub:release

# 6. Commit and push
cd ../..
git add .
git commit -m "chore: bump version to X.X.X"
git tag vX.X.X
git push origin main --tags
```

### 📚 Resources

- [CHANGELOG_GUIDE.md](./docs/CHANGELOG_GUIDE.md) - Complete changelog guide
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [NPM Publishing Guide](https://docs.npmjs.com/cli/v9/commands/npm-publish)
```