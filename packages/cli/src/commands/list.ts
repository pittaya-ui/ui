import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs/promises";
import { fetchRegistry } from "../utils/registry.js";
import { isComponentInstalled } from "../utils/component-checker.js";
import { applyPittayaProjectConfig, loadProjectConfig } from "../utils/project-config.js";
import { IConfig } from "../interfaces/IConfig.js";
import { IComponentIndexItem } from "../interfaces/IComponentIndexItem.js";

interface ListOptions {
  installed?: boolean;
  available?: boolean;
  json?: boolean;
}

interface ComponentInfo extends IComponentIndexItem {
  installed: boolean;
  version?: string;
}

export async function list(options: ListOptions) {
  const cwd = process.cwd();

  let config: IConfig;
  try {
    const loaded = await loadProjectConfig(cwd);
    config = loaded.config;
    applyPittayaProjectConfig(loaded.pittaya);
  } catch (error) {
    console.log(chalk.red("\n❌ components.json not found.\n"));
    console.log(
      chalk.dim(`Run ${chalk.bold("npx pittaya init")} first.\n`)
    );
    return;
  }

  const spinner = ora("Fetching components...").start();
  let registry;
  try {
    registry = await fetchRegistry(config);
    spinner.succeed("Components loaded!");
  } catch (error) {
    spinner.fail("Error loading registry");
    console.error(error);
    return;
  }

  const allComponents: any[] = registry.components || [];

  // Check installation status for each component
  const componentsWithStatus: ComponentInfo[] = await Promise.all(
    allComponents.map(async (comp) => {
      const slug = comp.slug || comp.name;
      const installed = await isComponentInstalled(slug, config);
      return {
        ...(comp.slug ? comp : { ...comp, slug }),
        installed,
      };
    })
  );

  let filteredComponents = componentsWithStatus;

  if (options.installed) {
    filteredComponents = componentsWithStatus.filter(comp => comp.installed);
  } else if (options.available) {
    filteredComponents = componentsWithStatus.filter(comp => !comp.installed);
  }


  if (options.json) {
    console.log(JSON.stringify(filteredComponents, null, 2));
    return;
  }


  displayComponents(filteredComponents, options);
}

function displayComponents(components: ComponentInfo[], options: ListOptions) {
  if (components.length === 0) {
    if (options.installed) {
      console.log(chalk.yellow("\n📦 No components installed yet.\n"));
      console.log(chalk.dim(`Run ${chalk.bold("npx pittaya add")} to install components.\n`));
    } else if (options.available) {
      console.log(chalk.yellow("\n✨ All components are already installed!\n"));
    } else {
      console.log(chalk.yellow("\n⚠️  No components found in registry.\n"));
    }
    return;
  }


  const categorized = components.reduce((acc, comp) => {
    const category = comp.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(comp);
    return acc;
  }, {} as Record<string, ComponentInfo[]>);

  console.log("\n");


  if (options.installed) {
    console.log(chalk.bold.green("📦 Installed Components\n"));
  } else if (options.available) {
    console.log(chalk.bold.blue("✨ Available Components\n"));
  } else {
    console.log(chalk.bold("📋 All Components\n"));
  }

  Object.entries(categorized).sort().forEach(([category, comps]) => {
    console.log(chalk.bold.cyan(`${category}:`));

    comps.forEach(comp => {
      const status = comp.installed
        ? chalk.green("✓")
        : chalk.dim("○");

      const name = comp.installed
        ? chalk.bold(comp.slug)
        : chalk.dim(comp.slug);

      const description = comp.description
        ? chalk.dim(` - ${comp.description}`)
        : "";

      const deps = comp.dependencies && comp.dependencies.length > 0
        ? chalk.dim.yellow(` [${comp.dependencies.length} deps]`)
        : "";

      const internalDeps = comp.internalDependencies && comp.internalDependencies.length > 0
        ? chalk.dim.blue(` [requires: ${comp.internalDependencies.join(", ")}]`)
        : "";

      console.log(`  ${status} ${name}${description}${deps}${internalDeps}`);
    });

    console.log();
  });

  const installedCount = components.filter(c => c.installed).length;
  const totalCount = components.length;

  if (!options.installed && !options.available) {
    console.log(chalk.dim(`Total: ${totalCount} components (${installedCount} installed, ${totalCount - installedCount} available)\n`));
  } else {
    console.log(chalk.dim(`Total: ${totalCount} components\n`));
  }
}

