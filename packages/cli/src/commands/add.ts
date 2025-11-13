import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { execa } from "execa";
import { fetchRegistry, getRegistryComponent } from "../utils/registry.js";
import { transformImports } from "../utils/transformer.js";
import { detectPackageManager, checkMissingDependencies } from "../utils/package-manager.js";
import { IAddOptions } from "../interfaces/IAddOptions";
import { IConfig } from "../interfaces/IConfig";
import { IRegistryComponent } from "../interfaces/IRegistryComponent";

export async function add(components: string[], options: IAddOptions) {
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

  const spinner = ora("Fetching available components...").start();
  let registry;
  try {
    registry = await fetchRegistry();
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
    await addComponent(componentName, config, options);
  }

  console.log(chalk.green("\n✅ Components added successfully!\n"));
}

async function addComponent(
  name: string,
  config: IConfig,
  options: IAddOptions
) {
  const spinner = ora(`Installing ${chalk.bold(name)}...`).start();

  try {
    const component: IRegistryComponent = await getRegistryComponent(name);

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
          const { install } = await prompts({
            type: "confirm",
            name: "install",
            message: "Do you want to install the dependencies now?",
            initial: true,
          });

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
      for (const dep of component.registryDependencies) {
        spinner.text = `Installing dependency ${dep}...`;
        await addComponent(dep, config, { ...options, yes: true });
      }
    }

    for (const file of component.files) {
      const targetPath = resolveTargetPath(file.name, component.type, config);
      const filePath = path.join(process.cwd(), targetPath);

      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (exists && !options.overwrite && !options.yes) {
        spinner.stop();
        const { overwrite } = await prompts({
          type: "confirm",
          name: "overwrite",
          message: `${targetPath} already exists. Overwrite?`,
          initial: false,
        });

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

