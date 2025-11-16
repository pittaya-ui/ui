# Pittaya UI

<div>
  <img src="https://img.shields.io/npm/dy/pittaya" alt="npm downloads" />
  <img src="https://img.shields.io/npm/v/pittaya" alt="npm version" />
  <img src="https://img.shields.io/github/license/pittaya-ui/ui" alt="license" />
</div>

A CLI for adding components to your project.

Usage

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures `tailwind.config.js`, and CSS variables for the project.

```bash
npx pittaya init
```

## add

Use the `add` command to add components to your project.

The `add` command adds a component to your project and installs all required dependencies.

```bash
 npx pittaya add [component]
```

### Example

```bash
npx pittaya add orbit-images
```

You can also run the command without any arguments to view a list of all available components:

```bash
npx pittaya add
```

## diff

Use the `diff` command to check for component updates.

The `diff` command compares your installed components with the registry and shows which ones have updates available.

```bash
npx pittaya diff [component]
```

### Example

```bash
# Check specific components
npx pittaya diff button orbit-images

# Check all installed components
npx pittaya diff --all

# Interactive mode
npx pittaya diff
```

## update

Use the `update` command to update components to the latest version.

The `update` command updates your installed components to match the registry version.

```bash
npx pittaya update [component]
```

### Example

```bash
# Update specific component
npx pittaya update button

# Update all components
npx pittaya update --all --yes

# Force update (even if no changes detected)
npx pittaya update button --force
```

## Documentation

Visit https://pittaya-ui.vercel.app to view the documentation.

### Additional Resources

- [Roadmap](../../ROADMAP.md) - 🗺️ Future plans and completed features
- [Changelog](../../CHANGELOG.md) - Version history and changes
- [Contributing Guide](../../CONTRIBUTING.md) - How to contribute
- [ADRs](../../docs/adr/README.md) - Architectural decisions

## Contributors

<a href="https://github.com/pittaya-ui/ui-kit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pittaya-ui/ui-kit" />
</a>

## License

Licensed under the [MIT license](https://github.com/pittaya-ui/cli/blob/main/LICENSE.md).
