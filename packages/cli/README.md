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

## Documentation

Visit https://pittaya-ui.vercel.app to view the documentation.

## Contributors

<a href="https://github.com/pittaya-ui/ui-kit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pittaya-ui/ui-kit" />
</a>

## License

Licensed under the [MIT license](https://github.com/pittaya-ui/cli/blob/main/LICENSE.md).
