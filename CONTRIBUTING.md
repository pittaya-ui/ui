# Contributing to Pittaya UI CLI

Thank you for considering contributing to Pittaya UI!

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm (or your preferred package manager)

### Project Setup

1. **Clone the repository:**

```bash
git clone https://github.com/pittaya-ui/ui.git
cd ui
```

2. **Install dependencies:**

```bash
npm install
```

3. **Build the CLI:**

```bash
npm run build
```

## 📁 Project Structure

```
ui/
├── packages/
│   └── cli/                 # CLI package
│       ├── src/
│       │   ├── commands/    # Commands (init, add, diff, update, list, debug, credits)
│       │   ├── utils/       # Utilities
│       │   ├── interfaces/  # TypeScript interfaces
│       │   └── index.ts     # Entry point
│       ├── package.json
│       └── tsup.config.ts
├── registry/                # Component registry
│   ├── schema.json         # Registry schema
│   └── styles/             # Styles and components
│       ├── new-york/
│       │   ├── index.json
│       │   └── components/
│       ├── default/
│       │   ├── index.json
│       │   └── components/
│       └── pittaya/
│           ├── index.json
│           └── components/

├── scripts/                # Build scripts
│   └── build-registry.ts   # Registry builder
├── .env.example            # Environment template
└── package.json            # Root workspace config
```

## 🔨 Development

### Available Scripts

```bash
# Build the CLI
npm run build

# Build registry from GitHub (default)
npm run build:registry

# Build registry from local UI repo (development)
npm run build:registry:dev

# Validate component dependencies
npm run validate:deps

# Install git hooks
npm run install:hooks

# Watch mode for development
npm run dev --workspace=packages/cli
```

### Local Testing

```bash
# Build the CLI
npm run build

# Link globally
cd packages/cli
npm link

# Test in a project
cd /path/to/test-project
pittaya init
pittaya add button

# Unlink when done
npm unlink -g pittaya
```

### Adding a New Command

1. Create a file in `packages/cli/src/commands/`
2. Implement the command logic
3. Register it in `packages/cli/src/index.ts`

Example:

```typescript
// packages/cli/src/commands/my-command.ts
import { Command } from "commander";

export function myCommand(program: Command) {
  program
    .command("my-command")
    .description("Does something cool")
    .action(async () => {
      // Implementation
    });
}
```

## 🔄 Updating the Registry

The registry can be built from two sources:

### 1. Configure Environment

Copy the template:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# GitHub mode (default) - Fetches from repository
USE_LOCAL_UI=false

# Local mode - Uses ../ui directory
# USE_LOCAL_UI=true
```

### 2. Build Registry

#### GitHub Mode (Default)

Fetches components from [pittaya-ui/ui](https://github.com/pittaya-ui/ui):

```bash
npm run build:registry
```

**When to use:**

- Publishing updates
- CI/CD pipelines
- Don't have UI repo locally

#### Local Mode (Development)

Uses local UI repo (`../ui` relative to CLI):

```bash
# Set in .env
USE_LOCAL_UI=true

# Build registry
npm run build:registry
```

**When to use:**

- Testing unreleased components
- Working on UI and CLI simultaneously
- Offline development

### 3. How It Works

The registry builder:

1. Reads components from `components-index.ts`
2. Uses **AST analysis** (TypeScript Compiler API) to detect dependencies automatically
3. Extracts both NPM dependencies and internal component dependencies
4. Generates JSONs in `registry/styles/<style>/components/`
5. Updates `registry/styles/<style>/index.json`
6. Validates all dependencies with `npm run validate:deps`

**Key Features:**

- 🤖 AST-based dependency detection (100% accuracy)
- 🔄 Automatic detection of relative imports
- ⚠️ Warnings for redundant manual declarations
- 🎨 Style-specific component variations

## 📝 Adding Components to Registry

### Component Guidelines

Before adding a component:

- ✅ Component should be generic and reusable
- ✅ Follow existing component patterns
- ✅ Include TypeScript types/interfaces
- ✅ Use Tailwind CSS for styling
- ✅ Support dark mode if applicable
- ✅ Include proper accessibility attributes
- ✅ Document props and usage

### Automatic (Recommended)

1. Add component in the UI repository's `src/components/ui/`
2. Register in `src/lib/docs/components-index.ts` with:
   - Component metadata (name, description, category)
   - NPM dependencies
   - Internal dependencies (other Pittaya components)
3. Run `npm run build:registry` to generate registry files
4. The build script will:
   - Use AST analysis to detect dependencies automatically
   - Generate JSON files for each style
   - Update the registry index
5. Commit and push changes

### Manual (Advanced)

Create a JSON file in `registry/styles/<style>/components/`:

```json
{
  "name": "my-component",
  "type": "registry:ui",
  "description": "Component description",
  "dependencies": ["@radix-ui/react-slot"],
  "registryDependencies": ["utils", "button"],
  "files": [
    {
      "name": "my-component.tsx",
      "content": "// stringified component code"
    }
  ]
}
```

**Important:**

- Create the component in **all styles** (`default`, `new-york`, `pittaya`)
- Each style can have different implementations
- Update `registry/styles/<style>/index.json` to include the component
- Run `npm run validate:deps` to ensure dependencies are correct

## 🧪 Testing Changes

### Test Init Command

```bash
cd /tmp
npx create-next-app@latest test-pittaya --typescript --tailwind --app
cd test-pittaya

# Use local CLI
pittaya init -y

# Verify
ls -la components.json
cat components.json  # Check configuration

# Test with different styles
pittaya init  # Interactive mode to choose style
```

### Test Add Command

```bash
# Add single component
pittaya add button

# Verify (src/ or root structure)
ls -la src/components/ui/button.tsx

# Test with dependencies
pittaya add orbit-images  # Has dependencies: button, utils

# Test in Next.js app
npm run dev
```

### Test Other Commands

```bash
# List components
pittaya list
pittaya list --installed

# Check for updates
pittaya diff
pittaya diff --all

# Update components
pittaya update button
pittaya update --all

# Debug issues
pittaya debug --component button

# View credits
pittaya credits
```

### Test with Different Configurations

- ✅ TypeScript vs JavaScript
- ✅ App Router vs Pages Router
- ✅ Different import aliases
- ✅ With/without `src/` directory (auto-detection)
- ✅ Different styles (`default`, `new-york`, `pittaya`)
- ✅ Different package managers (npm, yarn, pnpm)

## ✅ Pull Request Checklist

Before submitting a PR:

- [ ] Code follows project style conventions
- [ ] Build passes without errors (`npm run build`)
- [ ] Tested locally with `npm link`
- [ ] Registry regenerated if components changed (`npm run build:registry`)
- [ ] Dependencies validated (`npm run validate:deps`)
- [ ] Documentation updated (README, inline comments, ADRs if needed)
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] Changes tested with different project structures (src/ vs root)

## 🎯 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks (deps, registry)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `perf:` - Performance improvements
- `style:` - Code style changes (formatting, etc.)

### Examples:

```
feat(cli): add diff command to compare components
feat(list): add JSON output mode for programmatic use
fix(registry): resolve dependency extraction for nested imports
fix(add): handle missing dependencies correctly
docs: update README with new components
docs(adr): add ADR for AST-based dependency detection
chore: regenerate registry with latest UI components
chore(deps): update dependencies to latest versions
refactor(add): improve component selection logic
perf(registry): optimize component fetching speed
```

### Scope Guidelines:

- `(cli)` - CLI source code changes
- `(registry)` - Registry updates
- `(init)` / `(add)` / `(diff)` / `(update)` / `(list)` / `(debug)` - Specific commands
- `(deps)` - Dependency updates
- `(adr)` - Architecture Decision Records
- No scope for general changes

### Commit Message Best Practices:

- Use imperative mood ("add" not "added" or "adds")
- Keep first line under 72 characters
- Reference issues/PRs when relevant (`#123`)
- Provide context in the body for complex changes

## 📐 Architecture Decision Records (ADRs)

For significant architectural decisions, we document them using ADRs in `docs/adr/`.

### When to Create an ADR:

- Introducing a new technology or library
- Changing core architecture or design patterns
- Making decisions that affect future development
- Solving complex technical problems with multiple solutions

### How to Create an ADR:

1. Copy the template: `docs/adr/TEMPLATE.md`
2. Name it sequentially: `NNNN-short-title.md` (e.g., `0003-ast-based-detection.md`)
3. Fill in all sections:
   - Status (Proposed/Accepted/Rejected/Superseded)
   - Context (What problem are we solving?)
   - Decision (What did we decide?)
   - Consequences (What are the trade-offs?)
4. Create PR for review and discussion
5. Update `docs/adr/INDEX.md` when accepted

### Example ADRs:

- [ADR-0001: Adoption of ADRs](./docs/adr/0001-uso-de-adrs.md)
- [ADR-0002: AST for Dependency Detection](./docs/adr/0002-ast-para-deteccao-de-dependencias.md)
- [ADR-0003: Registry Style-Specific as Default](./docs/adr/0003-registry-style-specific-como-padrao.md)

## 🐛 Reporting Bugs

Open an [issue](https://github.com/pittaya-ui/ui/issues) with:

1. **Description** - Clear summary of the problem
2. **Steps to Reproduce** - Exact commands/steps
3. **Expected vs Actual** - What should happen vs what happens
4. **Environment:**
   - CLI version (`pittaya --version`)
   - Node version (`node --version`)
   - OS (Windows/Mac/Linux)
   - Package manager (npm/pnpm/yarn)
5. **Logs** - Error messages or stack traces

### Example Bug Report:

```markdown
**Description:**
CLI crashes when adding button component

**Steps:**

1. `npx create-next-app@latest test-app`
2. `cd test-app`
3. `npx pittaya@latest init`
4. `npx pittaya@latest add button`

**Expected:** Button component added to project
**Actual:** CLI crashes with error

**Environment:**

- CLI: 0.0.9 (`pittaya --version`)
- Node: 20.11.0 (`node --version`)
- OS: Windows 11
- Package manager: npm 10.2.4

**Error:**
[paste error message]
```

## 🔧 Troubleshooting

### Common Development Issues

#### Build Errors

**Issue:** `Cannot find module` errors during build

```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Registry Build Fails

**Issue:** `npm run build:registry` fails with fetch errors

```bash
# Check .env configuration
cat .env

# Try local mode instead
echo "USE_LOCAL_UI=true" > .env
npm run build:registry
```

#### Component Not Detected

**Issue:** Added component not showing in CLI

```bash
# 1. Verify component is in registry
cat registry/styles/pittaya/index.json | grep "your-component"

# 2. Rebuild registry
npm run build:registry

# 3. Test locally
cd packages/cli
npm link
pittaya list | grep "your-component"
```

#### Link Issues

**Issue:** `npm link` not working

```bash
# Unlink and re-link
npm unlink -g pittaya
cd packages/cli
npm run build
npm link

# Verify
which pittaya
pittaya --version
```

### Getting Help

If you're stuck:

1. Check existing [issues](https://github.com/pittaya-ui/ui/issues)
2. Search [discussions](https://github.com/pittaya-ui/ui/discussions)
3. Review [ADRs](./docs/adr/README.md) for architectural context
4. Open a new issue with detailed information

## 💡 Feature Requests

We'd love to hear your ideas! Open an [issue](https://github.com/pittaya-ui/ui/issues) with:

- **Problem** - What problem does this solve?
- **Proposed Solution** - How would you implement it?
- **Alternatives** - Any other solutions considered?
- **Examples** - Links to similar features in other projects

Tag with `enhancement`.

## 🔍 Code Review Process

1. **Automated Checks** - Build must pass
2. **Maintainer Review** - Code quality and design
3. **Testing** - Manual testing of changes
4. **Merge** - Squash and merge with conventional commit

## 📚 Resources

### Documentation

- [Pittaya UI Documentation](https://pittaya-ui.vercel.app)
- [Roadmap](./ROADMAP.md) - Feature roadmap and release schedule
- [Architecture Decision Records](./docs/adr/README.md) - Technical decisions and rationale
- [Changelog](./CHANGELOG.md) - Version history

### Technical References

- [shadcn/ui](https://github.com/shadcn-ui/ui) - Inspiration and reference
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [ts-morph](https://ts-morph.com/) - TypeScript AST manipulation
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message format

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

**Proprietary Use License** - You may use this CLI in any project, but you may not modify or redistribute the source code.

See [LICENSE](./LICENSE) for full terms.

---

## 🙏 Thank You!

Your contributions make Pittaya UI better for everyone. We appreciate your time and effort!

If you have questions, feel free to:

- Open a [Discussion](https://github.com/pittaya-ui/ui/discussions)
- Ask in [issues](https://github.com/pittaya-ui/ui/issues)
- Check existing documentation

Happy coding! 🚀
