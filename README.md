# Pittaya UI CLI

A powerful CLI to add Pittaya UI components to your React/Next.js project with intelligent dependency management and AST-based detection.

## 🚀 Installation

No installation required! Use directly with `npx`:

```bash
npx pittaya@latest init
```

**Current Version:** 0.0.9 ([View Changelog](./CHANGELOG.md))

## ✨ Features

- 🎯 **Smart Installation** - Automatically detects and skips already installed components
- 🔗 **Dependency Management** - Intelligently installs component dependencies
- 🛡️ **Preserves Customizations** - Won't overwrite your modified components
- 📦 **Internal Dependencies** - Components can declare dependencies on other Pittaya components
- 🤖 **AST-Based Detection** - 100% precision in detecting component dependencies using TypeScript Compiler API
- 🗑️ **Easy Removal** - Remove components and clean up empty directories with a single command
- ⚡ **Fast & Efficient** - Only installs what's needed
- 🔄 **Update Management** - Check for updates and update components easily
- 📋 **Component Discovery** - List all available and installed components with detailed information
- 🎨 **Import Transformation** - Automatically adjusts imports to your project structure
- 🌐 **GitHub Registry** - Components served via free CDN
- 🔄 **Idempotent** - Safe to run multiple times
- 🎨 **Multiple Styles** - Choose from `default`, `new-york`, or `pittaya` design styles
- 📁 **Auto-Detection** - Automatically detects `src/` directory structure
- 🐛 **Debug Tools** - Built-in diagnostics for troubleshooting

> 📖 See [ROADMAP.md](./ROADMAP.md) for upcoming features and completed milestones

## 📖 Usage

### Initialize Pittaya UI in your project

```bash
npx pittaya@latest init
```

This command will:

- Create a `components.json` file with your preferences
- Install required base dependencies
- Configure import aliases
- Apply style-specific CSS variables to your globals.css

#### Options

- `-y, --yes` - Use default settings without prompts

```bash
npx pittaya@latest init -y
```

### Add components

#### Add a specific component

```bash
npx pittaya@latest add button
```

#### Add multiple components

```bash
npx pittaya@latest add button badge skeleton
```

#### Add all components

```bash
npx pittaya@latest add --all
```

#### Interactive mode

If you don't specify components, it will enter interactive mode:

```bash
npx pittaya@latest add
```

#### Options

- `-y, --yes` - Overwrite existing files without prompting
- `-o, --overwrite` - Overwrite existing files
- `-a, --all` - Add all components
- `--add-missing-deps` - Automatically install missing dependencies

**Flag Comparison:**

| Flag                       | Overwrites Files | Auto-Installs Dependencies |
| -------------------------- | ---------------- | -------------------------- |
| `--yes`                    | ✅ Yes           | ❌ No                      |
| `--add-missing-deps`       | ❌ No            | ✅ Yes                     |
| `--yes --add-missing-deps` | ✅ Yes           | ✅ Yes                     |

### ⏭️ Smart Component Installation

The CLI automatically detects if a component is already installed and **skips reinstallation** to preserve your customizations:

```bash
# Install orbit-images (which depends on button and utils)
npx pittaya@latest add orbit-images
```

**First run:**

```
📦 orbit-images requires: button, utils
✓ button installed successfully!
✓ utils installed successfully!
✓ orbit-images installed successfully!
```

**Second run (components already installed):**

```
⏭️  orbit-images already installed, skipping...
```

**Benefits:**

- 🛡️ **Preserves Customizations** - Your modified components won't be overwritten
- ⚡ **Faster Installation** - Doesn't reinstall dependencies unnecessarily
- 🔄 **Idempotent** - Running the same command multiple times is safe

**Force Reinstallation:**

```bash
npx pittaya@latest add button --overwrite
```

> 📖 **Learn more:** See [SKIP_INSTALLED.md](./SKIP_INSTALLED.md) for detailed documentation.

#### Dependency Management

When adding a component, the CLI automatically checks for required dependencies. If any are missing, you'll see:

```bash
npx pittaya@latest add button
```

**Output:**

```
⚠️  button requires the following dependencies:

  • @radix-ui/react-slot

? Do you want to install the dependencies now? › (Y/n)
```

**Skip the prompt with `--add-missing-deps`:**

```bash
npx pittaya@latest add button --add-missing-deps
```

This will automatically install all missing dependencies without asking.

### Check for component updates

Check if your installed components have updates available in the registry:

```bash
npx pittaya@latest diff
```

This will show you an interactive list of installed components to check.

#### Check specific components

```bash
npx pittaya@latest diff button orbit-images
```

#### Check all installed components

```bash
npx pittaya@latest diff --all
```

**Output:**

```
📝 Components with updates available (2):

   • button
     └─ button.tsx (modified)
   • orbit-images
     └─ orbit-images.tsx (modified)

Run npx pittaya update <component> to update.

✅ Components up to date (1):

   • utils
```

### Update components

Update your installed components to the latest version from the registry:

```bash
npx pittaya@latest update
```

This will show you an interactive list of installed components to update.

#### Update specific components

```bash
npx pittaya@latest update button
```

#### Update all installed components

```bash
npx pittaya@latest update --all
```

#### Options

- `-y, --yes` - Skip confirmation prompts
- `-f, --force` - Force update even if no changes detected
- `-a, --all` - Update all installed components

**Examples:**

```bash
# Update all components without prompts
npx pittaya@latest update --all --yes

# Force update button (even if up to date)
npx pittaya@latest update button --force
```

**Output:**

```
✅ Updated 2 component(s):

   • button
   • orbit-images

⏭️  Skipped 1 component(s):

   • utils (already up to date)
```

### List components

View all available and installed components:

```bash
npx pittaya@latest list
```

This will show all components from the registry, organized by category, with installation status.

#### Options

- `--installed` - Show only installed components
- `--available` - Show only available components
- `--json` - Output in JSON format

### Remove components

Remove installed components from your project:

```bash
npx pittaya@latest remove button
```

#### Interactive mode

If you don't specify components, it will show a list of installed components to select for removal:

```bash
npx pittaya@latest remove
```

#### Options

- `-y, --yes` - Skip confirmation prompt

### Debug component issues

Diagnose why a component is not being detected as installed:

```bash
npx pittaya@latest debug --component installation-section
```

This will show:

- Project structure (src/ vs root)
- Resolved alias paths
- Expected file locations
- Actual file existence
- Similar files found (helps identify naming issues)

**Common issues it helps solve:**

- File name mismatches (e.g., `InstallationSection.tsx` vs `installation-section.tsx`)
- Wrong directory structure
- Incorrect `components.json` configuration

### View credits

Show the creators and contributors of Pittaya UI:

```bash
npx pittaya@latest credits
```

## 🎨 Available Components

### Actions

- **announcement-badge** - Displays an announcement badge with customizable styles
- **button** - Displays a button or a component that looks like a button
- **copy-button** - A button that copies content to clipboard

### Forms

- **checkbox** - A checkbox form control
- **input** - Text input field
- **label** - Form label component
- **multi-select** - Multi-selection dropdown component
- **radio-group** - Radio button group
- **textarea** - Multiline text input

### UI Components

- **badge** - Displays a badge with customizable styles
- **card** - Card container component
- **carousel** - Image carousel component
- **command** - Command palette component
- **orbit-images** - Displays images in an orbiting motion
- **popover** - Popover overlay component
- **tabs** - Tab navigation component

### Documentation

- **installation-section** - Displays installation instructions with code snippets

### Library

- **utils** - Utility functions for className management

> 💡 **Note:** Components are available in three styles: `default`, `new-york`, and `pittaya`. Each style has its own visual design and can include different implementations.

## 💡 Practical Examples

### Customization Workflow

```bash
# 1. Install a component
npx pittaya add button

# 2. Customize it in your project
# Edit: src/components/ui/button.tsx
# Add your own styles, logic, etc.

# 3. Install other components that depend on button
npx pittaya add modal card dialog orbit-images

# ✅ Result: Your customized button is preserved!
# Only modal, card, dialog, and orbit-images are installed
```

### Managing Dependencies

```bash
# Install a component with multiple dependencies
npx pittaya add orbit-images

# Output:
# 📦 orbit-images requires: button, utils
# ✓ button installed successfully!
# ✓ utils installed successfully!
# ✓ orbit-images installed successfully!

# Run again - nothing is reinstalled
npx pittaya add orbit-images

# Output:
# ⏭️  orbit-images already installed, skipping...
```

### Force Reinstallation

```bash
# Want to reset a component to its original state?
npx pittaya add button --overwrite

# This will:
# ✅ Overwrite the existing button.tsx
# ✅ Keep your other customized components intact
```

## 🔧 Configuration

The `components.json` file stores your preferences:

```json
{
  "$schema": "https://raw.githubusercontent.com/pittaya-ui/ui/main/registry/schema.json",
  "style": "pittaya",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Available Styles

- **`default`** - Clean and minimal design
- **`new-york`** - Modern and sophisticated look (inspired by shadcn/ui)
- **`pittaya`** - Rounded and vibrant design with primary colors

Each style provides different visual implementations of the same components.

## 🔄 Building Registry (For Maintainers)

### 🔗 Internal Dependencies

Components can declare dependencies on other Pittaya components using `internalDependencies` in the `components-index.ts` file:

```typescript
// ui/src/lib/docs/components-index.ts
{
  slug: "orbit-images",
  name: "Orbit Images",
  description: "Displays a set of images in an orbiting motion.",
  category: "Components",
  dependencies: ["framer-motion"],        // NPM dependencies
  internalDependencies: ["button"],       // Pittaya components
}
```

**When the registry is built**, `internalDependencies` are automatically added to `registryDependencies`:

```json
{
  "name": "orbit-images",
  "registryDependencies": [
    "button", // ⬅️ From internalDependencies
    "utils" // ⬅️ Auto-detected from code via AST
  ]
}
```

**When a user installs** the component, all dependencies are automatically installed:

```bash
npx pittaya add orbit-images
```

This will automatically install: `orbit-images` → `button` → `utils`

> 📖 **Learn more:** See [INTERNAL_DEPENDENCIES.md](./docs/INTERNAL_DEPENDENCIES.md) for detailed documentation.

---

The registry can be built from two sources. Configure via `.env` file:

### ⚙️ Configuration

1. **Copy the template:**

```bash
cp .env.example .env
```

2. **Edit `.env`:**

```bash
# GitHub mode (default) - Fetches from repository
USE_LOCAL_UI=false

# Local mode - Uses ../ui directory
# USE_LOCAL_UI=true
```

### 🌐 GitHub Mode (Default)

Fetches components directly from [pittaya-ui/ui](https://github.com/pittaya-ui/ui):

```bash
npm run build:registry
```

**Advantages:**

- ✅ No need to clone UI repository
- ✅ Always uses latest from `main` branch
- ✅ Works in CI/CD environments
- ✅ Completely decoupled repos

### 💻 Local Mode (Development)

Uses local UI repo (`../ui` relative to CLI):

```bash
# Set in .env:
USE_LOCAL_UI=true

# Then run:
npm run build:registry
```

**When to use:**

- Testing unreleased components
- Working on UI and CLI simultaneously
- No internet connection

### 📦 Publishing

#### 1. Build the CLI

```bash
cd packages/cli
npm run build
```

#### 2. Test Locally

```bash
# Test the built CLI
npm link
pittaya --version
```

#### 3. Publish to npm

```bash
npm run pub:release
```

✅ **Expected output:**

```
+ pittaya@0.0.9
```

#### 4. Test Published Package

```bash
# In a completely new project
npx create-next-app@latest test-published --typescript --tailwind --app
cd test-published

# Test with npx
npx pittaya@latest init -y
npx pittaya@latest add button

# Verify
cat src/components/ui/button.tsx
npm run dev
```

### Versioning

Follow [Semantic Versioning](https://semver.org/):

```bash
cd packages/cli

# Patch version (0.0.x) - Bug fixes
npm version patch

# Minor version (0.x.0) - New features
npm version minor

# Major version (x.0.0) - Breaking changes
npm version major

# Then publish
npm run pub:release
```

### Update Workflow

```bash
# 1. Make changes to CLI code
# 2. Update version
cd packages/cli
npm version patch  # or minor/major

# 3. Build and publish
npm run pub:release

# 4. Commit version bump
cd ../..
git add packages/cli/package.json
git commit -m "chore: bump cli to 0.0.10"
git push
```

### Validate Dependencies

Before publishing or committing registry changes, validate that all components have correct NPM dependencies declared:

```bash
# From root directory
npm run validate:deps
```

This will check all components and report any missing dependencies:

```bash
🔍 Validating dependencies in registry components...

✅ button - 2 dependencies OK
❌ installation-section
   Declared: [react-syntax-highlighter]
   Detected: [lucide-react, react-syntax-highlighter, sonner]
   Missing:  [lucide-react, sonner]

📊 Summary:
   Total components: 19
   With errors: 1
   Valid: 18
```

**Fix missing dependencies:**

1. Open the component JSON file (e.g., `registry/styles/pittaya/components/installation-section.json`)
2. Add missing dependencies to the `dependencies` array
3. Run `npm run validate:deps` again to confirm

**See:** [DEPENDENCY_VALIDATION.md](./docs/DEPENDENCY_VALIDATION.md) for detailed documentation.

### Common Publishing Issues

**Error: "Package name already taken"**

```bash
# Update name in packages/cli/package.json
{
  "name": "@pittaya-ui/cli"  // or another name
}
```

**Error: "Permission denied"**

```bash
npm whoami  # Check if logged in
npm logout
npm login
```

**Error: "Must provide one-time password"**

```bash
# 2FA is enabled, use OTP from authenticator app
npm publish --otp=123456
```

## 🎯 How It Works

1. **Style-Specific Registry** - Components are organized by style (`default`, `new-york`, `pittaya`)
2. **GitHub Registry** - Components are hosted via GitHub Raw (free CDN)
3. **Smart Detection** - CLI checks if components are already installed before adding them
4. **AST-Based Analysis** - Uses TypeScript Compiler API to detect dependencies with 100% accuracy
5. **Internal Dependencies** - Components can declare dependencies on other Pittaya components
6. **Automatic Installation** - NPM dependencies and related components are installed automatically
7. **Skip Installed** - Already installed components are skipped to preserve customizations
8. **Import Transformation** - Imports are adjusted according to your aliases
9. **Auto-Detection** - Automatically detects `src/` directory structure
10. **No Vendor Lock-in** - Components are copied to your project, you have full control

### Installation Flow

```
User runs: npx pittaya add orbit-images

1. Check if orbit-images is installed ✓
   └─ Not installed, proceed

2. Fetch orbit-images from registry ✓
   └─ Found: registryDependencies: [button, utils]

3. Install dependencies:
   ├─ Check if button is installed
   │  └─ Not installed, install button
   │     ├─ Check NPM deps: @radix-ui/react-slot
   │     └─ Install to: src/components/ui/button.tsx
   │
   └─ Check if utils is installed
      └─ Not installed, install utils
         ├─ Check NPM deps: clsx, tailwind-merge
         └─ Install to: src/lib/utils.ts

4. Install orbit-images ✓
   └─ Install to: src/components/ui/orbit-images.tsx

✅ Done! All components and dependencies installed.
```

**On second run:**

```
User runs: npx pittaya add orbit-images

1. Check if orbit-images is installed ✓
   └─ Already installed, skip!

⏭️ orbit-images already installed, skipping...
```

## 🔗 Links

### Documentation

- [Main Documentation](https://pittaya-ui.vercel.app)
- [Roadmap](./ROADMAP.md) - 🗺️ Future plans and completed features
- [Changelog](./CHANGELOG.md) - Version history and changes
- [Architecture Decision Records (ADRs)](./docs/adr/README.md) - Architectural decisions and rationale
- [Internal Dependencies Guide](./docs/INTERNAL_DEPENDENCIES.md)
- [Skip Installed Components Guide](./docs/SKIP_INSTALLED.md)

### Repository

- [GitHub - CLI & UI Monorepo](https://github.com/pittaya-ui/ui)
- [Component Registry - Default Style](https://raw.githubusercontent.com/pittaya-ui/ui/main/registry/styles/default/index.json)
- [Component Registry - New York Style](https://raw.githubusercontent.com/pittaya-ui/ui/main/registry/styles/new-york/index.json)
- [Component Registry - Pittaya Style](https://raw.githubusercontent.com/pittaya-ui/ui/main/registry/styles/pittaya/index.json)

## 🤝 Contributing

Contributions are welcome! See our:

- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Roadmap](ROADMAP.md) - Features we're working on
- [ADRs](./docs/adr/README.md) - Architectural decisions

## 📝 License

**Proprietary Use License** - You may use this CLI in any project, but you may not modify or redistribute the source code.

See [LICENSE](./LICENSE) for full terms.

© 2025 Pittaya UI - All rights reserved
