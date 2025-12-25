# Workflow Examples

This directory contains example GitHub Actions workflows for the Pittaya UI project.

## Available Examples

### 1. CLI Repository Workflow (Required)
**Location:** Already included at `cli/.github/workflows/validate.yml`

**Purpose:** Validates registry JSON files to ensure all NPM dependencies are correctly declared.

**Status:** ✅ Required - Already configured in the CLI repository

---

### 2. UI Repository Workflow (Optional)
**File:** `ui-repository-workflow.yml`

**Purpose:** Validates component source files and `components-index.ts` declarations.

**Status:** ⚠️ Optional - Only needed if you want extra validation

**To use:**
```bash
# In your UI repository
mkdir -p .github/workflows
cp cli/docs/workflow-examples/ui-repository-workflow.yml .github/workflows/validate-components.yml
git add .github/workflows/validate-components.yml
git commit -m "ci: add component validation workflow"
git push
```

---

## Quick Reference

| Repository | Workflow File | Status | Purpose |
|------------|--------------|--------|---------|
| CLI | `cli/.github/workflows/validate.yml` | ✅ Required | Validates registry JSON |
| UI | `ui/.github/workflows/validate-components.yml` | ⚠️ Optional | Validates source components |

---

## Why Two Workflows?

### CLI Repository Workflow (Primary)
- **Final gatekeeper** before publishing to NPM
- Validates the **actual registry** that users download
- Protects against manual JSON edits
- **Always runs** on registry changes

### UI Repository Workflow (Secondary)
- **Early warning system** during development
- Validates source code before it's built into registry
- Catches issues before `build:registry` runs
- **Optional** because CLI auto-detects dependencies

---

## Recommendation

### For Most Projects
```bash
# Only use CLI workflow
✅ cli/.github/workflows/validate.yml
```

**Why?** The `build:registry` script auto-detects dependencies, making the UI workflow redundant.

### For Large Teams
```bash
# Use both workflows
✅ cli/.github/workflows/validate.yml
✅ ui/.github/workflows/validate-components.yml
```

**Why?** Extra validation layer for peace of mind, especially with many contributors.

---

## Setup Instructions

### CLI Repository (Required)

Already configured! No action needed.

```bash
# Verify it's working
cd cli
git add .github/workflows/validate.yml
git commit -m "ci: update validation workflow"
git push

# Check GitHub Actions tab
```

### UI Repository (Optional)

```bash
# 1. Copy workflow file
cd ui
mkdir -p .github/workflows
cp ../cli/docs/workflow-examples/ui-repository-workflow.yml .github/workflows/validate-components.yml

# 2. Customize if needed
# Edit .github/workflows/validate-components.yml

# 3. Commit and push
git add .github/workflows/
git commit -m "ci: add component validation workflow"
git push

# 4. Verify in GitHub Actions tab
```

---

## Testing Workflows

### Test CLI Workflow

```bash
cd cli

# 1. Make a change to registry
echo '{"test": true}' >> registry/styles/new-york/components/button.json

# 2. Commit and push
git add registry/styles/new-york/components/button.json
git commit -m "test: trigger workflow"
git push

# 3. Check GitHub Actions
# Should fail because JSON is invalid
```

### Test UI Workflow

```bash
cd ui

# 1. Make a change to component
echo "// test" >> src/components/ui/button.tsx

# 2. Commit and push
git add src/components/ui/button.tsx
git commit -m "test: trigger workflow"
git push

# 3. Check GitHub Actions
# Should run build and lint
```

---

## Common Customizations

### Add Slack Notifications

```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: '❌ Dependency validation failed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Code Coverage

```yaml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

### Add Caching

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Matrix Testing

```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

---

## Troubleshooting

### Workflow Not Triggering

**Check path filters:**
```yaml
on:
  pull_request:
    paths:
      - 'registry/styles/**'  # Must match your structure
```

**Verify branch:**
```yaml
on:
  push:
    branches: [main]  # Must match your default branch
```

### Workflow Fails on CI

**Common issues:**
1. Node version mismatch
2. Missing environment variables
3. Different working directory

**Solution:**
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '20'  # Lock version
    
- run: npm ci  # Not npm install
  
- run: npm run validate:deps
  working-directory: ./cli  # If in monorepo
```

---

## See Also

- [WORKFLOWS_GUIDE.md](../WORKFLOWS_GUIDE.md) - Complete guide
- [AUTOMATION.md](../AUTOMATION.md) - Automation overview
- [DEPENDENCY_VALIDATION.md](../DEPENDENCY_VALIDATION.md) - Validation details

