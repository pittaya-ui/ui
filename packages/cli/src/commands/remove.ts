import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { fetchRegistry, getRegistryComponent } from "../utils/registry.js";
import { isComponentInstalled, resolveTargetPath } from "../utils/component-checker.js";
import { applyPittayaProjectConfig, loadProjectConfig } from "../utils/project-config.js";
import { confirm } from "../utils/confirm.js";
import { IConfig } from "../interfaces/IConfig.js";
import { IRegistryComponent } from "../interfaces/IRegistryComponent.js";

interface RemoveOptions {
  yes?: boolean;
}

export async function remove(components: string[], options: RemoveOptions) {
  const cwd = process.cwd();

  let config: IConfig;
  let pittayaConfig: any;
  try {
    const loaded = await loadProjectConfig(cwd);
    config = loaded.config;
    pittayaConfig = loaded.pittaya;
    applyPittayaProjectConfig(pittayaConfig);
  } catch (error) {
    console.log(chalk.red("\n❌ components.json not found.\n"));
    console.log(
      chalk.dim(`Run ${chalk.bold("npx pittaya init")} first.\n`)
    );
    return;
  }

  const spinner = ora("Fetching installed components...").start();
  let registry;
  try {
    registry = await fetchRegistry(config);
    spinner.succeed("Registry loaded!");
  } catch (error) {
    spinner.fail("Error loading registry");
    console.error(error);
    return;
  }

  // Se nenhum componente foi passado via argumento, mostramos a lista para selecionar
  if (components.length === 0) {
    const allComponents: any[] = registry.components || [];
    
    // Filtramos apenas os que estão instalados
    const installedComponents = [];
    for (const comp of allComponents) {
      const slug = comp.slug || comp.name;
      if (await isComponentInstalled(slug, config)) {
        installedComponents.push({
          title: `${slug}${comp.description ? ` - ${comp.description}` : ""}`,
          value: slug,
        });
      }
    }

    if (installedComponents.length === 0) {
      console.log(chalk.yellow("\n📦 No components installed to remove.\n"));
      return;
    }

    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "Select components to remove:",
      choices: installedComponents,
      min: 1,
    });

    if (!selected || selected.length === 0) {
      console.log(chalk.yellow("\n❌ No components selected.\n"));
      return;
    }

    components = selected;
  }

  // Confirmação final
  if (!options.yes) {
    const confirmed = await confirm(
      `Are you sure you want to remove ${chalk.bold(components.join(", "))}?`,
      false
    );

    if (!confirmed) {
      console.log(chalk.yellow("\n❌ Operation cancelled.\n"));
      return;
    }
  }

  console.log(
    chalk.dim(`\nRemoving ${components.length} component(s)...\n`)
  );

  for (const componentName of components) {
    await removeComponent(componentName, config);
  }

  console.log(chalk.green("\n✅ Components removed successfully!\n"));
}

async function removeComponent(name: string, config: IConfig) {
  const spinner = ora(`Removing ${chalk.bold(name)}...`).start();

  try {
    const component: IRegistryComponent = await getRegistryComponent(name, config);

    if (!component) {
      spinner.fail(`Component "${name}" not found in registry.`);
      return;
    }

    const removedFiles: string[] = [];

    for (const file of component.files) {
      const targetPath = await resolveTargetPath(file.name, component.type, config);
      const filePath = path.join(process.cwd(), targetPath);

      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        await fs.unlink(filePath);
        removedFiles.push(filePath);
      }
    }

    // Tentar remover as pastas que ficaram vazias
    for (const filePath of removedFiles) {
      await removeEmptyDirs(path.dirname(filePath));
    }

    spinner.succeed(`${chalk.bold(name)} removed successfully!`);
  } catch (error) {
    spinner.fail(`Error removing ${name}`);
    console.error(error);
  }
}

async function removeEmptyDirs(dirPath: string) {
  try {
    const files = await fs.readdir(dirPath);
    if (files.length === 0) {
      await fs.rmdir(dirPath);
      // Recursivamente tentar remover a pasta pai
      await removeEmptyDirs(path.dirname(dirPath));
    }
  } catch {
    // Silenciosamente falha se não conseguir remover (ex: permissão ou não existe)
  }
}
