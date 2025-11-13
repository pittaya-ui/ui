# Pittaya UI CLI

CLI to add Pittaya UI components to your React/Next.js project

## 🚀 Installation

No installation required! Use directly with `npx` (Soon)

```bash
npx pittaya@latest init
```

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

| Flag | Sobrescreve Arquivos | Instala Dependências Automaticamente |
|------|---------------------|--------------------------------------|
| `--yes` | ✅ Sim | ❌ Não |
| `--add-missing-deps` | ❌ Não | ✅ Sim |
| `--yes --add-missing-deps` | ✅ Sim | ✅ Sim |

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

## 🎨 Available Components

### Actions
- **button** - Displays a button or a component that looks like a button

### Documentation
- **installation-section** - Displays installation instructions with code snippets

### Library
- **utils** - Utility functions for className

> 💡 **Note:** New components are automatically added when you add them to the `components-index.ts` file in the UI project and run `npm run build:registry`.

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
2. **Automatic Installation** - npm dependencies and related components are installed automatically
3. **Import Transformation** - Imports are adjusted according to your aliases
4. **No Vendor Lock-in** - Components are copied to your project, you have full control

## 🔗 Links

- [Documentation](https://pittaya-ui.vercel.app)
- [GitHub](https://github.com/pittaya-ui/cli)
- [Registry](https://raw.githubusercontent.com/pittaya-ui/cli/main/registry/index.json)

## 🤝 Contributing

Contributions are welcome! See our [contribution guide](CONTRIBUTING.md).

## 📝 License

**Proprietary Use License** - You may use this CLI in any project, but you may not modify or redistribute the source code.

See [LICENSE](./LICENSE) for full terms.

© 2025 Pittaya UI - All rights reserved


