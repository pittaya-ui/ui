# Automatic Directory Structure Detection

## Problem Solved

Previously, the Pittaya UI CLI assumed all projects used the `src/` directory structure, resulting in incorrect imports for projects using root-level structure.

### Example of Previous Problem:

**Project WITH `src/`:**
- ✅ Worked: `@/lib/utils` → `src/lib/utils`

**Project WITHOUT `src/` (root):**
- ❌ Broke: `@/lib/utils` → `src/lib/utils` (directory doesn't exist!)
- ✅ Should be: `@/lib/utils` → `lib/utils`

## Implemented Solution

### 1. Automatic Structure Detection

We created the `project-structure.ts` module with utility functions:

```typescript
// Detects if the project uses src/
export async function hasSrcDirectory(cwd: string): Promise<boolean>

// Resolves alias paths (@/) to real file system paths
export async function resolveAliasPath(aliasPath: string, cwd: string): Promise<string>

// Returns defaults based on project structure
export async function getDefaultPaths(cwd: string)
```

### 2. How Detection Works

The `hasSrcDirectory()` function checks:

1. **Existence of `src/` directory**
2. **Presence of common Next.js directories inside `src/`:**
   - `app/`
   - `components/`
   - `lib/`
   - `pages/`
3. **Configuration in `tsconfig.json`:**
   - Checks if `@/*` points to `./src/*`

If **any** of these checks is positive, it considers the project uses `src/`.

### 3. Command Changes

#### `init` Command

**Before:**
```typescript
// Hardcoded values
initial: "src/app/globals.css"
```

**After:**
```typescript
// Automatically detects
const defaultPaths = await getDefaultPaths(cwd);
initial: defaultPaths.globalsCss  // "src/app/globals.css" OR "app/globals.css"
```

#### `resolveTargetPath` Function

**Before:**
```typescript
// Hardcoded to src/
config.aliases.ui.replace("@/", "src/")
```

**After:**
```typescript
// Dynamically detects
const resolvedPath = await resolveAliasPath(config.aliases.ui);
```

## Usage Examples

### Project with `src/`

```bash
project/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
└── tsconfig.json
```

**Result:**
- `@/lib/utils` → `src/lib/utils` ✅
- `@/components/ui` → `src/components/ui` ✅

### Project without `src/` (root)

```bash
project/
├── app/
├── components/
├── lib/
└── tsconfig.json
```

**Result:**
- `@/lib/utils` → `lib/utils` ✅
- `@/components/ui` → `components/ui` ✅

## Modified Files

1. **`src/utils/project-structure.ts`** *(new)*
   - Structure detection functions

2. **`src/commands/init.ts`**
   - Uses `getDefaultPaths()` to suggest correct paths

3. **`src/utils/component-checker.ts`**
   - `resolveTargetPath()` is now async
   - Uses `resolveAliasPath()` instead of hardcoded values

4. **`src/commands/add.ts`**
   - Updated to use `await resolveTargetPath()`

5. **`src/commands/diff.ts`**
   - Updated to use `await resolveTargetPath()`

6. **`src/commands/update.ts`**
   - Updated to use `await resolveTargetPath()`

## Benefits

✅ **Universal Compatibility** - Works with both `src/` and root-level structure  
✅ **Zero Configuration** - Automatically detects without asking the user  
✅ **Backwards Compatible** - Existing projects continue to work  
✅ **Correct Imports** - Components installed with proper paths for project structure  

## Testing

To test the solution:

### Test 1: Project with `src/`
```bash
mkdir test-with-src && cd test-with-src
npm init -y
mkdir -p src/app src/components src/lib
npx pittaya init --yes
# Should use "src/app/globals.css"
```

### Test 2: Project without `src/`
```bash
mkdir test-without-src && cd test-without-src
npm init -y
mkdir -p app components lib
npx pittaya init --yes
# Should use "app/globals.css"
```

### Test 3: Add component
```bash
npx pittaya add button
# Imports should be correct based on structure
```

## Troubleshooting

### Debug Structure Detection

If components aren't being installed in the correct location:

```bash
# Check project structure detection
npx pittaya debug

# Debug specific component
npx pittaya debug --component button
```

This will show:
- Detected structure (`src/` vs root)
- Resolved alias paths
- Expected vs actual file locations

### Component Not Found

If a component shows as "not installed" but exists in your project:

1. **Check file name:** Component files use kebab-case (e.g., `installation-section.tsx`, not `InstallationSection.tsx`)
2. **Check location:** Files should be in the resolved UI path (use `debug` command to see expected path)
3. **Verify structure:** Ensure your project structure matches what CLI detected

## Technical Notes

- Detection happens at **runtime**, not cached
- Performance is not affected (file checking is fast)
- Works with monorepos (detects by `cwd`)
- Compatible with all package managers (npm, yarn, pnpm)

