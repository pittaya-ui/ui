# Repository Structure & Workflows

## Overview

The Pittaya UI project consists of two main repositories with different responsibilities:

```
┌─────────────────────────────────────────────────────────────┐
│                    Pittaya UI Ecosystem                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐         ┌────────────────────────┐│
│  │  UI Repository      │         │  CLI Repository        ││
│  │  (Source)          │────────▶│  (Distribution)       ││
│  │                     │         │                        ││
│  │ src/components/ui/  │         │ registry/components/   ││
│  │ ├─ button.tsx       │  Build  │ ├─ button.json        ││
│  │ ├─ badge.tsx        │────────▶│ ├─ badge.json         ││
│  │ └─ ...             │         │ └─ ...                ││
│  │                     │         │                        ││
│  │ components-index.ts │         │ scripts/               ││
│  │ (declarations)      │         │ └─ build-registry.ts   ││
│  └─────────────────────┘         └────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Repository Purposes

### 1. UI Repository (`ui/`)

**Purpose:** Component source code and documentation website

**Contains:**
- ✅ Component source files (`src/components/ui/*.tsx`)
- ✅ Component declarations (`components-index.ts`)
- ✅ Documentation site (Next.js)
- ✅ Component examples and demos

**Workflow:**
```
Developer → Edits component → Commits → (Optional CI) → Merged
```

**Published To:** Vercel (documentation site)

---

### 2. CLI Repository (`cli/`)

**Purpose:** CLI tool and component registry

**Contains:**
- ✅ CLI source code (`packages/cli/src/`)
- ✅ Registry JSON files (`registry/components/*.json`)
- ✅ Build scripts (`scripts/build-registry.ts`)
- ✅ Validation scripts (`scripts/validate-dependencies.ts`)

**Workflow:**
```
Run build:registry → Generates JSON → Validates → Commits → CI validates → Merged → Published to NPM
```

**Published To:** NPM (`pittaya` package)

---

## Workflow Placement

### ✅ CLI Repository (REQUIRED)

**File:** `cli/.github/workflows/validate.yml`

**Triggers:**
- PR changes to `registry/components/**`
- Push to `main` branch

**What it does:**
```bash
1. Checkout code
2. Install dependencies
3. Run npm run validate:deps
4. ✅ Pass = merge allowed
   ❌ Fail = blocks merge
```

**Why here?**
- Final validation before NPM publish
- Protects the actual registry users download
- Critical safety check

**Status:** ✅ Already configured

---

### ⚠️ UI Repository (OPTIONAL)

**File:** `ui/.github/workflows/validate-components.yml`

**Triggers:**
- PR changes to `src/components/ui/**`
- PR changes to `components-index.ts`

**What it does:**
```bash
1. Checkout code
2. Install dependencies
3. Build project
4. Run linter
5. Type check
```

**Why here?**
- Early feedback during component development
- Ensures code quality before registry build
- Redundant (build:registry auto-detects)

**Status:** ⚠️ Optional (example provided)

---

## Data Flow

### Component Creation Flow

```
┌────────────────────────────────────────────────────────────────┐
│ Step 1: Developer creates component in UI repository           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ui/src/components/ui/new-component.tsx                        │
│  ↓                                                              │
│  import { Button } from "@radix-ui/react-slot"                 │
│  import { cva } from "class-variance-authority"                │
│  import { cn } from "@/lib/utils"                              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 2: Add to components-index.ts (optional declarations)     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  {                                                              │
│    slug: "new-component",                                      │
│    description: "...",                                         │
│    dependencies: ["@radix-ui/react-slot"], // Optional        │
│  }                                                              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 3: Build registry in CLI repository                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  $ cd cli                                                       │
│  $ npm run build:registry                                      │
│  ↓                                                              │
│  1. Fetches new-component.tsx from UI repo                     │
│  2. Auto-detects dependencies:                                 │
│     ✅ @radix-ui/react-slot                                    │
│     ✅ class-variance-authority                                │
│  3. Merges with manual declarations                            │
│  4. Generates registry/components/new-component.json           │
│  5. Validates automatically                                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 4: Validation (automatic)                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 Validating dependencies...                                 │
│  ✅ All dependencies correctly declared                        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 5: Commit and push                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  $ git add registry/components/new-component.json              │
│  $ git commit -m "feat: add new-component"                     │
│  $ git push                                                     │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 6: CI validates (GitHub Actions)                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Workflow: validate.yml                                        │
│  ✅ Runs npm run validate:deps                                 │
│  ✅ Passes → PR can be merged                                  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Step 7: Publish to NPM                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  $ npm run build                                                │
│  $ npm run release                                             │
│  ↓                                                              │
│  Users can now: npx pittaya add new-component                  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Validation Points

### Point 1: Local Development (Manual - Rare)
```bash
# Only if editing JSON directly
npm run validate:deps
```

### Point 2: Build Registry (Automatic)
```bash
npm run build:registry
# 🔍 Validating dependencies...
#    ✅ All dependencies correctly declared
```

### Point 3: Pre-commit Hook (Optional)
```bash
git commit
# Hook runs automatically
# ✅ Validation passed
```

### Point 4: CI/CD (Automatic)
```bash
# GitHub Actions runs on every PR
# ✅ validate.yml passes
```

### Point 5: Pre-publish (Recommended)
```bash
npm run validate:deps
npm run build
npm run release
```

---

## File Organization

### CLI Repository Structure

```
cli/
├── .github/
│   └── workflows/
│       └── validate.yml          ← ✅ Required workflow
│
├── packages/cli/
│   ├── src/
│   │   ├── commands/
│   │   ├── utils/
│   │   └── index.ts
│   └── package.json
│
├── registry/
│   ├── components/
│   │   ├── button.json           ← Validated by CI
│   │   ├── badge.json            ← Validated by CI
│   │   └── ...
│   ├── index.json
│   └── schema.json
│
├── scripts/
│   ├── build-registry.ts         ← Auto-detects + validates
│   ├── validate-dependencies.ts  ← Manual validation
│   └── install-hooks.sh          ← Git hook installer
│
├── docs/
│   ├── WORKFLOWS_GUIDE.md        ← This guide
│   ├── AUTOMATION.md
│   └── workflow-examples/
│       └── ui-repository-workflow.yml
│
└── package.json
```

### UI Repository Structure

```
ui/
├── .github/
│   └── workflows/
│       └── validate-components.yml  ← ⚠️ Optional workflow
│
├── src/
│   ├── components/ui/
│   │   ├── button.tsx              ← Source components
│   │   ├── badge.tsx
│   │   └── ...
│   │
│   └── lib/docs/
│       ├── components-index.ts     ← Component declarations
│       └── types.ts
│
└── package.json
```

---

## Decision Matrix

### Should I add workflow to UI repository?

| Your Situation | Recommendation | Reason |
|----------------|---------------|--------|
| Solo developer | ❌ No | CLI auto-detects everything |
| Small team (2-5) | ⚠️ Optional | Nice to have, not critical |
| Large team (5+) | ✅ Yes | Early feedback helps |
| Open source project | ✅ Yes | Many contributors need guardrails |
| Private project | ⚠️ Optional | CLI validation is enough |
| Rapid iteration | ❌ No | Less friction |
| Strict process | ✅ Yes | Double validation |

---

## Quick Commands

### CLI Repository (Required Setup)

```bash
# Already done - just verify
ls -la .github/workflows/validate.yml

# Test it works
git add registry/
git commit -m "test: workflow"
git push

# Check GitHub Actions tab
```

### UI Repository (Optional Setup)

```bash
# Copy example workflow
mkdir -p .github/workflows
cp cli/docs/workflow-examples/ui-repository-workflow.yml \
   .github/workflows/validate-components.yml

# Commit and test
git add .github/workflows/
git commit -m "ci: add component validation"
git push
```

---

## Summary

### CLI Repository Workflow
- **Location:** `cli/.github/workflows/validate.yml`
- **Status:** ✅ Required - Already configured
- **Purpose:** Validate registry JSON before NPM publish
- **Runs:** On every registry change
- **Action:** None needed (already set up)

### UI Repository Workflow
- **Location:** `ui/.github/workflows/validate-components.yml`
- **Status:** ⚠️ Optional - Example provided
- **Purpose:** Early validation during development
- **Runs:** On component source changes
- **Action:** Copy example if desired

### Recommendation
**Just use the CLI workflow.** It's sufficient for most cases because:
- ✅ `build:registry` auto-detects dependencies
- ✅ Final gatekeeper before publish
- ✅ Less maintenance overhead

Add UI workflow only if:
- Large team with many contributors
- Want early feedback during development
- Paranoid about manual declarations

---

## See Also

- [WORKFLOWS_GUIDE.md](./WORKFLOWS_GUIDE.md) - Detailed workflow documentation
- [AUTOMATION_SUMMARY.md](./AUTOMATION_SUMMARY.md) - Quick automation reference
- [AUTOMATION.md](./AUTOMATION.md) - Full automation guide
- [workflow-examples/](./workflow-examples/) - Example workflow files

