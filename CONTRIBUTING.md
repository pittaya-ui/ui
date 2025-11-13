# Contributing to Pittaya UI CLI

Thank you for considering contributing to Pittaya UI!

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm (or your preferred package manager)

### Project Setup

1. **Clone the repository:**
```bash
git clone https://github.com/pittaya-ui/cli.git
cd cli
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
cli/
├── packages/
│   └── cli/                 # CLI package
│       ├── src/
│       │   ├── commands/    # Commands (init, add, credits)
│       │   ├── utils/       # Utilities
│       │   └── index.ts     # Entry point
│       ├── package.json
│       └── tsup.config.ts
├── registry/                # Component registry
│   ├── schema.json         # Registry schema
│   ├── index.json          # Component index
│   └── components/         # Individual components
├── scripts/                # Build scripts
│   └── build-registry.ts   # Registry builder
├── .env.example            # Environment template
└── package.json            # Root workspace config
```

## 🔨 Development

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
import { Command } from 'commander';

export function myCommand(program: Command) {
  program
    .command('my-command')
    .description('Does something cool')
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
2. Extracts dependencies from code
3. Generates individual JSONs in `registry/components/`
4. Updates `registry/index.json`

## 📝 Adding Components to Registry

### Automatic (Recommended)

1. Add component in `pittaya-hq/ui/src/components/ui/`
2. Register in `pittaya-hq/ui/src/lib/docs/components-index.ts`
3. Run `npm run build:registry`
4. Commit and push

### Manual (Advanced)

Create a JSON file in `registry/components/`:

```json
{
  "name": "my-component",
  "type": "registry:ui",
  "description": "Component description",
  "dependencies": [
    "@radix-ui/react-slot"
  ],
  "registryDependencies": ["utils"],
  "files": [
    {
      "name": "my-component.tsx",
      "content": "// stringified component code"
    }
  ]
}
```

Update `registry/index.json` to include the component.

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
```

### Test Add Command

```bash
# Add single component
pittaya add button

# Verify
ls -la components/pittaya/ui/button.tsx

# Test in Next.js app
npm run dev
```

### Test with Different Configurations

- ✅ TypeScript vs JavaScript
- ✅ App Router vs Pages Router
- ✅ Different import aliases
- ✅ With/without src directory

## ✅ Pull Request Checklist

Before submitting a PR:

- [ ] Code follows project style conventions
- [ ] Build passes without errors (`npm run build`)
- [ ] Tested locally with `npm link`
- [ ] Registry regenerated if components changed
- [ ] Documentation updated (README, inline comments)
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

## 🎯 Commit Convention

We use Conventional Commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks (deps, registry)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `perf:` - Performance improvements

### Examples:

```
feat(cli): add diff command to compare components
fix(registry): resolve dependency extraction for nested imports
docs: update README with new components
chore: regenerate registry with latest UI components
refactor(add): improve component selection logic
```

### Scope Guidelines:

- `(cli)` - CLI source code changes
- `(registry)` - Registry updates
- `(init)` / `(add)` - Specific commands
- No scope for general changes

## 🐛 Reporting Bugs

Open an [issue](https://github.com/pittaya-ui/cli/issues) with:

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
- CLI: 0.0.1
- Node: 20.11.0
- OS: Windows 11
- Package manager: npm 10.2.4

**Error:**
[paste error message]
```

## 💡 Feature Requests

We'd love to hear your ideas! Open an [issue](https://github.com/pittaya-ui/cli/issues) with:

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

- [Pittaya UI Documentation](https://pittaya-ui.vercel.app)
- [shadcn/ui](https://github.com/shadcn-ui/ui) - Inspiration and reference
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [ts-morph](https://ts-morph.com/) - TypeScript AST manipulation

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

**Proprietary Use License** - You may use this CLI in any project, but you may not modify or redistribute the source code.

See [LICENSE](./LICENSE) for full terms.

---

## 🙏 Thank You!

Your contributions make Pittaya UI better for everyone. We appreciate your time and effort!

If you have questions, feel free to:
- Open a [Discussion](https://github.com/pittaya-ui/cli/discussions)
- Ask in issues
- Check existing documentation

Happy coding! 🚀
