import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { execa } from "execa";
import { fetchRegistry, getRegistryComponent } from "../utils/registry.js";
import { transformImports } from "../utils/transformer.js";
import { detectPackageManager, checkMissingDependencies } from "../utils/package-manager.js";
import { isComponentInstalled, resolveTargetPath } from "../utils/component-checker.js";
import { applyPittayaProjectConfig, loadProjectConfig } from "../utils/project-config.js";
import { confirm } from "../utils/confirm.js";
import { IAddOptions } from "../interfaces/IAddOptions";
import { IConfig } from "../interfaces/IConfig";
import { IRegistryComponent } from "../interfaces/IRegistryComponent";

export async function add(components: string[], options: IAddOptions) {
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

  const resolvedOptions: IAddOptions = {
    ...options,
    addMissingDeps: options.addMissingDeps ?? pittayaConfig?.install?.autoInstallDeps ?? false,
  };

  const spinner = ora("Fetching available components...").start();
  let registry;
  try {
    registry = await fetchRegistry(config);
    spinner.succeed("Registry loaded!");
  } catch (error) {
    spinner.fail("Error loading registry");
    console.error(error);
    return;
  }

  if (options.all) {
    components = registry.components
      .filter((comp: any) => comp.type === "registry:ui")
      .map((comp: any) => comp.name);
  }

  if (components.length === 0) {
    const availableComponents = registry.components
      .filter((comp: any) => comp.type === "registry:ui")
      .map((comp: any) => ({
        title: `${comp.name}${comp.description ? ` - ${comp.description}` : ""}`,
        value: comp.name,
      }));

    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "Select components to add:",
      choices: availableComponents,
      min: 1,
    });

    if (!selected || selected.length === 0) {
      console.log(chalk.yellow("\n❌ No components selected.\n"));
      return;
    }

    components = selected;
  }

  console.log(
    chalk.dim(`\nAdding ${components.length} component(s)...\n`)
  );

  for (const componentName of components) {
    await addComponent(componentName, config, resolvedOptions);
  }

  console.log(chalk.green("\n✅ Components added successfully!\n"));
}

async function addComponent(
  name: string,
  config: IConfig,
  options: IAddOptions
) {
  const alreadyInstalled = await isComponentInstalled(name, config);
  if (alreadyInstalled && !options.overwrite) {
    console.log(chalk.dim(`   ⏭️  ${name} already installed, skipping...`));
    return;
  }

  const spinner = ora(`Installing ${chalk.bold(name)}...`).start();

  try {
    const component: IRegistryComponent = await getRegistryComponent(name, config);

    if (!component) {
      spinner.fail(`Component "${name}" not found in registry.`);
      return;
    }

    const packageManager = await detectPackageManager();

    if (component.dependencies && component.dependencies.length > 0) {
      const missingDeps = await checkMissingDependencies(component.dependencies);

      if (missingDeps.length > 0) {
        spinner.stop();

        console.log(chalk.yellow(`\n⚠️  ${name} requires the following dependencies:\n`));
        missingDeps.forEach(dep => {
          console.log(chalk.dim(`  • ${dep}`));
        });
        console.log();

        // If --add-missing-deps was passed, install automatically
        if (options.addMissingDeps) {
          console.log(chalk.dim("Installing dependencies automatically...\n"));
        } else {
          const install = await confirm(
            "Do you want to install the dependencies now?",
            true
          );

          if (!install) {
            console.log(chalk.yellow("\n⚠️  Component not installed. Install the dependencies manually and try again.\n"));
            return;
          }
        }

        spinner.start(`Installing dependencies for ${name}...`);

        try {
          await execa(packageManager, [
            packageManager === "yarn" ? "add" : "install",
            ...missingDeps,
          ]);
          spinner.succeed(`Dependencies installed!`);
          spinner.start(`Installing ${chalk.bold(name)}...`);
        } catch (error) {
          spinner.fail(`Error installing dependencies`);
          console.error(error);
          return;
        }
      }
    }

    if (component.registryDependencies && component.registryDependencies.length > 0) {
      spinner.stop();
      console.log(chalk.dim(`\n   📦 ${name} requires: ${component.registryDependencies.join(", ")}`));

      for (const dep of component.registryDependencies) {
        await addComponent(dep, config, { ...options, yes: true });
      }

      console.log(); // Linha em branco
      spinner.start(`Installing ${chalk.bold(name)}...`);
    }

    for (const file of component.files) {
      const targetPath = await resolveTargetPath(file.name, component.type, config);
      const filePath = path.join(process.cwd(), targetPath);

      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (exists && !options.overwrite && !options.yes) {
        spinner.stop();
        const overwrite = await confirm(
          `${targetPath} already exists. Overwrite?`,
          false
        );

        if (!overwrite) {
          spinner.warn(`Skipping ${targetPath}`);
          continue;
        }
        spinner.start();
      }

      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const content = transformImports(file.content, config);

      await fs.writeFile(filePath, content, "utf-8");
    }

    spinner.succeed(`${chalk.bold(name)} installed successfully!`);
  } catch (error) {
    spinner.fail(`Error installing ${name}`);
    console.error(error);
  }
}

