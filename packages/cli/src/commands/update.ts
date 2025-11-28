import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { fetchRegistry, getRegistryComponent } from "../utils/registry.js";
import { transformImports } from "../utils/transformer.js";
import { isComponentInstalled, resolveTargetPath } from "../utils/component-checker.js";
import { IConfig } from "../interfaces/IConfig";
import { IRegistryComponent } from "../interfaces/IRegistryComponent";

interface UpdateOptions {
  all?: boolean;
  yes?: boolean;
  force?: boolean;
}

interface UpdateResult {
  name: string;
  updated: boolean;
  skipped: boolean;
  reason?: string;
}

export async function update(components: string[], options: UpdateOptions) {
  const cwd = process.cwd();
  const componentsJsonPath = path.join(cwd, "components.json");

  let config: IConfig;
  try {
    const configContent = await fs.readFile(componentsJsonPath, "utf-8");
    config = JSON.parse(configContent);
  } catch (error) {
    console.log(chalk.red("\n❌ components.json not found.\n"));
    console.log(
      chalk.dim(`Run ${chalk.bold("npx pittaya init")} first.\n`)
    );
    return;
  }

  const spinner = ora("Fetching registry...").start();
  let registry;
  try {
    registry = await fetchRegistry();
    spinner.succeed("Registry loaded!");
  } catch (error) {
    spinner.fail("Error loading registry");
    console.error(error);
    return;
  }

  let componentsToUpdate: string[] = [];

  if (options.all) {
    // Update all installed components
    const allComponents = registry.components
      .filter((comp: any) => comp.type === "registry:ui" || comp.type === "registry:lib")
      .map((comp: any) => comp.name);

    for (const comp of allComponents) {
      const isInstalled = await isComponentInstalled(comp, config);
      if (isInstalled) {
        componentsToUpdate.push(comp);
      }
    }

    if (componentsToUpdate.length === 0) {
      console.log(chalk.yellow("\n⚠️  No components installed yet.\n"));
      return;
    }

    if (!options.yes && !options.force) {
      const { confirm } = await prompts({
        type: "confirm",
        name: "confirm",
        message: `Update ${componentsToUpdate.length} component(s)?`,
        initial: true,
      });

      if (!confirm) {
        console.log(chalk.yellow("\n❌ Update cancelled.\n"));
        return;
      }
    }
  } else if (components.length === 0) {
    // Interactive mode - show only installed components with updates
    const allComponents = registry.components
      .filter((comp: any) => comp.type === "registry:ui" || comp.type === "registry:lib")
      .map((comp: any) => comp.name);

    const installedComponents = [];
    for (const comp of allComponents) {
      const isInstalled = await isComponentInstalled(comp, config);
      if (isInstalled) {
        installedComponents.push(comp);
      }
    }

    if (installedComponents.length === 0) {
      console.log(chalk.yellow("\n⚠️  No components installed yet.\n"));
      return;
    }

    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "Select components to update:",
      choices: installedComponents.map(name => ({
        title: name,
        value: name,
      })),
      min: 1,
    });

    if (!selected || selected.length === 0) {
      console.log(chalk.yellow("\n❌ No components selected.\n"));
      return;
    }

    componentsToUpdate = selected;
  } else {
    componentsToUpdate = components;
  }

  console.log(chalk.dim(`\nChecking ${componentsToUpdate.length} component(s) for updates...\n`));

  const results: UpdateResult[] = [];

  for (const componentName of componentsToUpdate) {
    const result = await updateComponent(componentName, config, options);
    results.push(result);
  }

  // Display results
  displayUpdateResults(results);
}

async function hasComponentChanges(
  component: IRegistryComponent,
  config: IConfig
): Promise<boolean> {
  for (const file of component.files) {
    const targetPath = resolveTargetPath(file.name, component.type, config);
    const filePath = path.join(process.cwd(), targetPath);

    try {
      const localContent = await fs.readFile(filePath, "utf-8");
      const registryContent = transformImports(file.content, config);

      if (localContent.trim() !== registryContent.trim()) {
        return true;
      }
    } catch {
      // If we can't read the file, consider it as having changes
      return true;
    }
  }

  return false;
}

async function updateComponent(
  name: string,
  config: IConfig,
  options: UpdateOptions
): Promise<UpdateResult> {
  try {
    const component: IRegistryComponent = await getRegistryComponent(name);
    if (!component) {
      console.log(chalk.red(`   ❌ Component "${name}" not found in registry.`));
      return { name, updated: false, skipped: true, reason: "not found in registry" };
    }

    const isInstalled = await isComponentInstalled(name, config);
    if (!isInstalled) {
      console.log(chalk.dim(`   ⏭️  ${name} is not installed, skipping...`));
      return { name, updated: false, skipped: true, reason: "not installed" };
    }

    // Check if there are changes
    const hasChanges = await hasComponentChanges(component, config);

    if (!hasChanges && !options.force) {
      console.log(chalk.dim(`   ✓ ${name} is already up to date`));
      return { name, updated: false, skipped: true, reason: "already up to date" };
    }

    // Ask for confirmation if not --yes or --force
    if (!options.yes && !options.force) {
      const { confirm } = await prompts({
        type: "confirm",
        name: "confirm",
        message: `Update ${chalk.bold(name)}?`,
        initial: true,
      });

      if (!confirm) {
        console.log(chalk.yellow(`   ⏭️  Skipped ${name}`));
        return { name, updated: false, skipped: true, reason: "user cancelled" };
      }
    }

    const spinner = ora(`Updating ${chalk.bold(name)}...`).start();

    // Update files
    for (const file of component.files) {
      const targetPath = resolveTargetPath(file.name, component.type, config);
      const filePath = path.join(process.cwd(), targetPath);

      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const content = transformImports(file.content, config);
      await fs.writeFile(filePath, content, "utf-8");
    }

    spinner.succeed(`${chalk.bold(name)} updated successfully!`);
    return { name, updated: true, skipped: false };
  } catch (error) {
    console.log(chalk.red(`   ❌ Error updating ${name}`));
    console.error(error);
    return { name, updated: false, skipped: true, reason: "error" };
  }
}

function displayUpdateResults(results: UpdateResult[]) {
  const updated = results.filter((r) => r.updated);
  const skipped = results.filter((r) => r.skipped);

  console.log();

  if (updated.length > 0) {
    console.log(chalk.green(`✅ Updated ${updated.length} component(s):\n`));
    for (const result of updated) {
      console.log(chalk.dim(`   • ${result.name}`));
    }
  }

  if (skipped.length > 0) {
    console.log(chalk.yellow(`\n⏭️  Skipped ${skipped.length} component(s):\n`));
    for (const result of skipped) {
      const reason = result.reason ? ` (${result.reason})` : "";
      console.log(chalk.dim(`   • ${result.name}${reason}`));
    }
  }

  console.log();
}

