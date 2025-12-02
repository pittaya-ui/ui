# Dependency Validation System

## Overview

The Pittaya UI registry uses a validation system to ensure all NPM dependencies used in components are properly declared in their JSON files. This prevents installation errors where users try to use components that import packages not installed in their project.

## Problem Solved

**Before:**
- Components could use `import { toast } from "sonner"` without declaring `"sonner"` in dependencies
- Users would get TypeScript errors: `Cannot find module 'sonner'`
- Manual checking was required to find missing dependencies

**After:**
- Automated validation script detects missing dependencies
- CI/CD integration prevents merging components with missing deps
- Clear error messages show exactly what's missing

## How It Works

### 1. Dependency Detection

The validation script (`validate-dependencies.ts`) analyzes component code using regex to find all NPM imports:

```typescript
// Detects imports like:
import { Button } from "@radix-ui/react-slot"  // ✅ Detected
import { toast } from "sonner"                  // ✅ Detected
import { cn } from "@/lib/utils"                // ❌ Ignored (internal)
import Button from "./button"                   // ❌ Ignored (relative)
```

**Detection Rules:**
- ✅ Captures: External NPM packages
- ✅ Handles: Scoped packages (`@radix-ui/react-slot`)
- ✅ Handles: Sub-paths (`react-syntax-highlighter/dist/esm/...`)
- ❌ Excludes: `react`, `react-dom`, `next` (peer dependencies)
- ❌ Excludes: Internal imports (`@/...`)
- ❌ Excludes: Relative imports (`./`, `../`)

### 2. Validation Process

```typescript
// For each component:
1. Read component JSON file
2. Extract code content
3. Detect NPM dependencies from imports
4. Compare with declared dependencies
5. Report missing dependencies
```

### 3. Validation Script

Run the validation:

```bash
# From cli/ directory
npm run validate:deps

# Or directly
npx tsx scripts/validate-dependencies.ts
```

**Output Example:**

```bash
🔍 Validating dependencies in registry components...

✅ announcement-badge - 2 dependencies OK
❌ button
   Declared: [@radix-ui/react-slot]
   Detected: [@radix-ui/react-slot, class-variance-authority]
   Missing:  [class-variance-authority]

❌ installation-section
   Declared: [react-syntax-highlighter, @types/react-syntax-highlighter]
   Detected: [lucide-react, react-syntax-highlighter, sonner]
   Missing:  [lucide-react, sonner]

📊 Summary:
   Total components: 6
   With errors: 2
   Valid: 4

⚠️  Some components have missing dependencies!
💡 To fix: Add missing dependencies to the component JSON files
```

## Component JSON Structure

### Correct Example

```json
{
  "name": "installation-section",
  "type": "registry:ui",
  "description": "Displays installation instructions with code snippets.",
  "dependencies": [
    "lucide-react",
    "react-syntax-highlighter",
    "@types/react-syntax-highlighter",
    "sonner"
  ],
  "registryDependencies": [
    "copy-button",
    "tabs",
    "utils"
  ],
  "files": [
    {
      "name": "installation-section.tsx",
      "content": "..."
    }
  ]
}
```

### Key Fields

- **`dependencies`**: NPM packages that need to be installed
  - Must include ALL external packages imported in the code
  - Excludes: `react`, `react-dom`, `next` (peer dependencies)
  
- **`registryDependencies`**: Internal Pittaya UI components
  - Other components from the registry (`button`, `tabs`, etc.)
  - Always includes `utils` if `@/lib/utils` is imported

## Fixing Missing Dependencies

### Step 1: Run Validation

```bash
npm run validate:deps
```

### Step 2: Identify Errors

Look for components marked with ❌ and check the "Missing" line.

### Step 3: Update Component JSON

Add missing dependencies to the `dependencies` array:

```json
{
  "dependencies": [
    "existing-dep",
    "missing-dep"  // ← Add this
  ]
}
```

### Step 4: Re-validate

```bash
npm run validate:deps
```

Should now show ✅ for all components.

## Automated Registry Building

The `build-registry.ts` script automatically detects dependencies when building the registry from the UI repository:

```typescript
// Automatically extracts NPM dependencies
const dependencies = extractNpmDependencies(content);

// Example output:
// ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"]
```

**When building from source:**
```bash
npm run build:registry
```

The script will:
1. Fetch components from UI repository
2. Extract dependencies automatically
3. Generate JSON files with correct dependencies
4. Validate using AST analysis for `registryDependencies`

## Best Practices

### 1. Always Validate Before Committing

```bash
# Add to your pre-commit workflow
npm run validate:deps
```

### 2. Keep Dependencies Minimal

Only include dependencies that are actually imported:

```typescript
// ❌ Bad: Declaring unused dependencies
"dependencies": [
  "lodash",          // Not used
  "@radix-ui/react-slot"
]

// ✅ Good: Only what's imported
"dependencies": [
  "@radix-ui/react-slot"  // Actually used
]
```

### 3. Document Special Cases

If a dependency is optional or conditional:

```json
{
  "description": "Button component. Optionally uses Radix Slot for asChild prop.",
  "dependencies": [
    "@radix-ui/react-slot"
  ]
}
```

### 4. Update After Code Changes

After modifying component code:

```bash
# 1. Update the component
# 2. Validate
npm run validate:deps
# 3. Fix any new missing dependencies
# 4. Commit
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Validate Registry

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run validate:deps
```

This prevents merging PRs with missing dependencies.

## Common Issues

### Issue 1: Scoped Packages Not Detected

**Problem:**
```
Missing: [@radix-ui]  # Wrong - incomplete package name
```

**Solution:**
The script correctly handles scoped packages. Check if the import is correct:
```typescript
// ✅ Correct
import { Slot } from "@radix-ui/react-slot"

// ❌ Wrong
import { Slot } from "@radix-ui"
```

### Issue 2: Sub-path Imports

**Problem:**
```typescript
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight"
```

**Solution:**
The script automatically extracts the base package (`react-syntax-highlighter`). Just declare:
```json
"dependencies": ["react-syntax-highlighter"]
```

### Issue 3: Type-only Imports

**Problem:**
```typescript
import type { ComponentProps } from "react"
```

**Solution:**
Type-only imports of peer dependencies (`react`, `react-dom`, `next`) are ignored. No action needed.

For other packages:
```typescript
import type { Highlighter } from "shiki"
// Must declare "shiki" in dependencies
```

## Troubleshooting

### Component Not Detected as Installed

If `update` or `diff` commands show a component as "not installed" but you believe it's there:

```bash
# Use debug command to investigate
npx pittaya debug --component installation-section
```

This will show:
- Expected file paths
- Actual file existence
- File name mismatches (e.g., `InstallationSection.tsx` vs `installation-section.tsx`)
- Similar files in the directory

### False Positives

If the validator reports a missing dependency that shouldn't be required:

1. Check if it's a peer dependency (should be excluded)
2. Check if it's an internal import (should use `@/`)
3. Report an issue with the validation script

### False Negatives

If a dependency is required but not detected:

1. Check the import syntax
2. Ensure it's not a dynamic import
3. Add manually to `dependencies` array

## Related Documentation

- [ADR-0002: AST for Dependency Detection](./adr/0002-ast-para-deteccao-de-dependencias.md)
- [Build Registry Guide](./INTERNAL_DEPENDENCIES.md)
- [Contributing Guide](../CONTRIBUTING.md)

## Scripts Reference

```bash
# Validate all components
npm run validate:deps

# Build registry from source (auto-detects dependencies)
npm run build:registry

# Build CLI package
npm run build

# Development mode
npm run dev
```

## Summary

✅ **Automated** - No manual checking required  
✅ **Reliable** - Regex + AST analysis  
✅ **Fast** - Validates all components in seconds  
✅ **CI-Ready** - Easy to integrate into workflows  
✅ **Clear Errors** - Shows exactly what's missing  

Keep your registry clean and your users happy! 🎉

