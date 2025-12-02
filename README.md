# Pittaya UI CLI

CLI to add Pittaya UI components to your React/Next.js project

## 🚀 Installation

No installation required! Use directly with `npx` (Soon)

```bash
npx pittaya@latest init
```

## ✨ Features

- 🎯 **Smart Installation** - Automatically detects and skips already installed components
- 🔗 **Dependency Management** - Intelligently installs component dependencies
- 🛡️ **Preserves Customizations** - Won't overwrite your modified components
- 📦 **Internal Dependencies** - Components can declare dependencies on other Pittaya components
- 🤖 **AST-Based Detection** - 100% precision in detecting component dependencies using TypeScript Compiler API
- ⚡ **Fast & Efficient** - Only installs what's needed
- 🔄 **Update Management** - Check for updates and update components easily
- 📋 **Component Discovery** - List all available and installed components with detailed information
- 🎨 **Import Transformation** - Automatically adjusts imports to your project structure
- 🌐 **GitHub Registry** - Components served via free CDN
- 🔄 **Idempotent** - Safe to run multiple times

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

| Flag                         | Sobrescreve Arquivos | Instala Dependências Automaticamente |
| ---------------------------- | -------------------- | ------------------------------------- |
| `--yes`                    | ✅ Sim               | ❌ Não                               |
| `--add-missing-deps`       | ❌ Não              | ✅ Sim                                |
| `--yes --add-missing-deps` | ✅ Sim               | ✅ Sim                                |

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
⚠️  button requer as seguintes dependências:

  • @radix-ui/react-slot

? Deseja instalar as dependências agora? › (Y/n)
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

#### Show only installed components

```bash
npx pittaya@latest list --installed
```

#### Show only available components

```bash
npx pittaya@latest list --available
```

#### JSON output

For programmatic use:

```bash
npx pittaya@latest list --json
```

**Output:**

```
📋 All Components

Actions:
  ✓ button - Displays a button or a component that looks like a button [1 deps]
  ○ dropdown-menu - Displays a menu to the user [requires: button]

Documentation:
  ✓ installation-section - Displays installation instructions [2 deps]

Total: 3 components (2 installed, 1 available)
```

**Legend:**
- ✓ = Installed
- ○ = Available (not installed)
- [N deps] = Number of npm dependencies
- [requires: X, Y] = Requires other Pittaya components

## 🎨 Available Components

### Actions

- **button** - Displays a button or a component that looks like a button

### Documentation

- **installation-section** - Displays installation instructions with code snippets

### Library

- **utils** - Utility functions for className

> 💡 **Note:** New components are automatically added when you add them to the `components-index.ts` file in the UI project and run `npm run build:registry`.

## 💡 Practical Examples

### Customization Workflow

```bash
# 1. Install a component
npx pittaya add button

# 2. Customize it in your project
# Edit: src/components/pittaya/ui/button.tsx
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
  "$schema": "https://raw.githubusercontent.com/pittaya-ui/cli/main/registry/schema.json",
  "style": "new-york",
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
    "ui": "@/components/pittaya/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

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
    "button",  // ⬅️ From internalDependencies
    "utils"    // ⬅️ Auto-detected from code
  ]
}
```

**When a user installs** the component, all dependencies are automatically installed:

```bash
npx pittaya add orbit-images
```

This will automatically install: `orbit-images` → `button` → `utils`

> 📖 **Learn more:** See [INTERNAL_DEPENDENCIES.md](./INTERNAL_DEPENDENCIES.md) for detailed documentation.

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

---

✅ **Expected output:**

```
+ pittaya@0.0.1
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
cat components/pittaya/ui/button.tsx
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
git commit -m "chore: bump cli to 0.0.2"
git push
```

### Validate Dependencies

Before publishing or committing registry changes, you can manually validate that all components have correct NPM dependencies declared - although the registry makes it automatically:

```bash
# From cli/ directory
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
   Total components: 6
   With errors: 1
   Valid: 5
```

**Fix missing dependencies:**

1. Open the component JSON file (e.g., `registry/components/installation-section.json`)
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

---

## 🎯 How It Works

1. **GitHub Registry** - Components are hosted via GitHub Raw (free CDN)
2. **Smart Detection** - CLI checks if components are already installed before adding them
3. **Internal Dependencies** - Components can declare dependencies on other Pittaya components via `internalDependencies`
4. **Automatic Installation** - NPM dependencies and related components are installed automatically
5. **Skip Installed** - Already installed components are skipped to preserve customizations
6. **Import Transformation** - Imports are adjusted according to your aliases
7. **No Vendor Lock-in** - Components are copied to your project, you have full control

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
   │     └─ Install to: src/components/pittaya/ui/button.tsx
   │
   └─ Check if utils is installed
      └─ Not installed, install utils
         ├─ Check NPM deps: clsx, tailwind-merge
         └─ Install to: src/lib/utils.ts

4. Install orbit-images ✓
   └─ Install to: src/components/pittaya/ui/orbit-images.tsx

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

- [GitHub - CLI](https://github.com/pittaya-ui/cli)
- [GitHub - UI Components](https://github.com/pittaya-ui/ui)
- [Component Registry](https://raw.githubusercontent.com/pittaya-ui/cli/main/registry/index.json)

## 🤝 Contributing

Contributions are welcome! See our:
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Roadmap](ROADMAP.md) - Features we're working on
- [ADRs](./docs/adr/README.md) - Architectural decisions

## 📝 License

**Proprietary Use License** - You may use this CLI in any project, but you may not modify or redistribute the source code.

See [LICENSE](./LICENSE) for full terms.

© 2025 Pittaya UI - All rights reserved
