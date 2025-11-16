import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { fetchRegistry, getRegistryComponent } from "../utils/registry.js";
import { transformImports } from "../utils/transformer.js";
import { IConfig } from "../interfaces/IConfig";
import { IRegistryComponent } from "../interfaces/IRegistryComponent";

interface DiffOptions {
  all?: boolean;
}

interface ComponentDiff {
  name: string;
  hasChanges: boolean;
  files: FileDiff[];
  isInstalled: boolean;
}

interface FileDiff {
  name: string;
  hasChanges: boolean;
  isNew: boolean;
  isMissing: boolean;
}

export async function diff(components: string[], options: DiffOptions) {
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

  let componentsToCheck: string[] = [];

  if (options.all) {
    // Check all installed components
    const allComponents = registry.components
      .filter((comp: any) => comp.type === "registry:ui" || comp.type === "registry:lib")
      .map((comp: any) => comp.name);

    for (const comp of allComponents) {
      const isInstalled = await isComponentInstalled(comp, config);
      if (isInstalled) {
        componentsToCheck.push(comp);
      }
    }

    if (componentsToCheck.length === 0) {
      console.log(chalk.yellow("\n⚠️  No components installed yet.\n"));
      return;
    }
  } else if (components.length === 0) {
    // Interactive mode - show only installed components
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
      message: "Select components to check for updates:",
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

    componentsToCheck = selected;
  } else {
    componentsToCheck = components;
  }

  console.log(chalk.dim(`\nChecking ${componentsToCheck.length} component(s)...\n`));

  const results: ComponentDiff[] = [];

  for (const componentName of componentsToCheck) {
    const diffResult = await checkComponentDiff(componentName, config);
    if (diffResult) {
      results.push(diffResult);
    }
  }

  // Display results
  displayDiffResults(results);
}

async function isComponentInstalled(
  name: string,
  config: IConfig
): Promise<boolean> {
  try {
    const component: IRegistryComponent = await getRegistryComponent(name);
    if (!component) return false;

    for (const file of component.files) {
      const targetPath = resolveTargetPath(file.name, component.type, config);
      const filePath = path.join(process.cwd(), targetPath);

      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (!exists) return false;
    }

    return true;
  } catch {
    return false;
  }
}

async function checkComponentDiff(
  name: string,
  config: IConfig
): Promise<ComponentDiff | null> {
  try {
    const component: IRegistryComponent = await getRegistryComponent(name);
    if (!component) {
      console.log(chalk.red(`   ❌ Component "${name}" not found in registry.`));
      return null;
    }

    const isInstalled = await isComponentInstalled(name, config);
    if (!isInstalled) {
      console.log(chalk.dim(`   ⏭️  ${name} is not installed, skipping...`));
      return null;
    }

    const fileDiffs: FileDiff[] = [];
    let hasChanges = false;

    for (const file of component.files) {
      const targetPath = resolveTargetPath(file.name, component.type, config);
      const filePath = path.join(process.cwd(), targetPath);

      try {
        const localContent = await fs.readFile(filePath, "utf-8");
        const registryContent = transformImports(file.content, config);

        const contentMatches = localContent.trim() === registryContent.trim();

        fileDiffs.push({
          name: file.name,
          hasChanges: !contentMatches,
          isNew: false,
          isMissing: false,
        });

        if (!contentMatches) {
          hasChanges = true;
        }
      } catch (error) {
        // File exists check passed but can't read - treat as missing
        fileDiffs.push({
          name: file.name,
          hasChanges: true,
          isNew: false,
          isMissing: true,
        });
        hasChanges = true;
      }
    }

    return {
      name,
      hasChanges,
      files: fileDiffs,
      isInstalled: true,
    };
  } catch (error) {
    console.log(chalk.red(`   ❌ Error checking ${name}`));
    console.error(error);
    return null;
  }
}

function displayDiffResults(results: ComponentDiff[]) {
  const componentsWithChanges = results.filter((r) => r.hasChanges);
  const componentsUpToDate = results.filter((r) => !r.hasChanges);

  console.log();

  if (componentsWithChanges.length > 0) {
    console.log(chalk.yellow(`📝 Components with updates available (${componentsWithChanges.length}):\n`));

    for (const result of componentsWithChanges) {
      console.log(chalk.yellow(`   • ${chalk.bold(result.name)}`));

      for (const file of result.files) {
        if (file.hasChanges) {
          if (file.isMissing) {
            console.log(chalk.red(`     └─ ${file.name} (missing locally)`));
          } else {
            console.log(chalk.dim(`     └─ ${file.name} (modified)`));
          }
        }
      }
    }
    console.log();
    console.log(chalk.dim(`Run ${chalk.bold("npx pittaya update <component>")} to update.`));
  }

  if (componentsUpToDate.length > 0) {
    console.log(chalk.green(`\n✅ Components up to date (${componentsUpToDate.length}):\n`));

    for (const result of componentsUpToDate) {
      console.log(chalk.dim(`   • ${result.name}`));
    }
  }

  console.log();
}

function resolveTargetPath(
  fileName: string,
  type: string,
  config: IConfig
): string {
  if (type === "registry:ui") {
    return path.join(
      config.aliases.ui.replace("@/", "src/"),
      fileName
    );
  }

  if (type === "registry:lib") {
    return path.join(
      config.aliases.lib.replace("@/", "src/"),
      fileName
    );
  }

  if (type === "registry:hook") {
    return path.join(
      config.aliases.hooks.replace("@/", "src/"),
      fileName
    );
  }

  return fileName;
}

