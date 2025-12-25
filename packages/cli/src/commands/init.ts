import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { execa } from "execa";
import { getDefaultPaths } from "../utils/project-structure.js";
import { getRegistryComponent } from "../utils/registry.js";
import { applyRegistryStyleToProject } from "../utils/style-installer.js";
import { detectPackageManager } from "../utils/package-manager.js";
import { IPittayaProjectConfig } from "../interfaces/IPittayaProjectConfig.js";
import { applyPittayaProjectConfig } from "../utils/project-config.js";
import { confirm } from "../utils/confirm.js";

interface InitOptions {
  yes?: boolean;
}

export async function init(options: InitOptions) {
  const pittayaColorHex = "#f2556d";
  console.log(
    chalk.bold(
      `\nWelcome to ${chalk.hex(pittayaColorHex)("Pittaya")} UI!\n`
    )
  );

  const cwd = process.cwd();
  const componentsJsonPath = path.join(cwd, "components.json");
  const pittayaJsonPath = path.join(cwd, "pittaya.json");

  const exists = await fs
    .access(componentsJsonPath)
    .then(() => true)
    .catch(() => false);

  const pittayaExists = await fs
    .access(pittayaJsonPath)
    .then(() => true)
    .catch(() => false);

  if (exists && !options.yes) {
    const overwrite = await confirm(
      `${chalk.underline("components.json")} already exists. Do you want to overwrite it?`,
      false
    );

    if (!overwrite) {
      console.log(chalk.yellow("\n❌ Operation cancelled.\n"));
      return;
    }
  }

  let shouldWritePittayaJson = true;
  if (pittayaExists && !options.yes) {
    const overwrite = await confirm(
      `${chalk.underline("pittaya.json")} already exists. Do you want to overwrite it?`,
      false
    );

    if (!overwrite) {
      shouldWritePittayaJson = false;
    }
  }

  const defaultPaths = await getDefaultPaths(cwd);

  const config = options.yes
    ? {
      style: "pittaya",
      tailwindCss: defaultPaths.globalsCss,
      rsc: true,
      componentsPath: defaultPaths.components,
      utilsPath: defaultPaths.utils,
    }
    : await prompts([
      {
        type: "select",
        name: "style",
        message: "Which style would you like to use?",
        choices: [
          { title: "Pittaya", value: "pittaya" },
          { title: "New York", value: "new-york" },
          { title: "Default", value: "default" },
        ],
      },
      {
        type: "text",
        name: "tailwindCss",
        message: "Where is your globals.css file?",
        initial: defaultPaths.globalsCss,
      },
      {
        type: "select",
        name: "rsc",
        message: "Use React Server Components?",
        choices: [
          { title: "Yes", value: true },
          { title: "No", value: false },
        ],
        initial: 0,
      },
      {
        type: "text",
        name: "componentsPath",
        message: "Path for components?",
        initial: defaultPaths.components,
      },
      {
        type: "text",
        name: "utilsPath",
        message: "Path for utils?",
        initial: defaultPaths.utils,
      },
    ]);

  if (!config.style && !options.yes) {
    console.log(chalk.yellow("\n❌ Operation cancelled.\n"));
    return;
  }

  const componentsJson = {
    $schema: "https://raw.githubusercontent.com/pittaya-ui/cli/main/registry/schema.json",
    style: config.style || "pittaya",
    rsc: config.rsc ?? true,
    tsx: true,
    tailwind: {
      config: "",
      css: config.tailwindCss || "src/app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: config.componentsPath || "@/components",
      utils: config.utilsPath || "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    iconLibrary: "lucide",
  };

  let pittayaJson: IPittayaProjectConfig = {
    registry: {
      url: "https://raw.githubusercontent.com/pittaya-ui/cli/main/registry",
      preferLocal: false,
    },
    theme: {
      overwriteCssVars: true,
    },
    install: {
      autoInstallDeps: true,
    },
  };

  if (!shouldWritePittayaJson) {
    try {
      const raw = await fs.readFile(pittayaJsonPath, "utf-8");
      pittayaJson = JSON.parse(raw) as IPittayaProjectConfig;
    } catch {
      shouldWritePittayaJson = true;
    }
  }

  const spinner = ora("Creating components.json...").start();
  await fs.writeFile(
    componentsJsonPath,
    JSON.stringify(componentsJson, null, 2)
  );
  spinner.succeed("components.json created successfully!");

  if (shouldWritePittayaJson) {
    const pittayaSpinner = ora("Creating pittaya.json...").start();
    await fs.writeFile(pittayaJsonPath, JSON.stringify(pittayaJson, null, 2));
    pittayaSpinner.succeed("pittaya.json created successfully!");
  }

  applyPittayaProjectConfig(pittayaJson);

  const depsSpinner = ora("Installing base dependencies...").start();
  try {
    const packageManager = await detectPackageManager();
    await execa(packageManager, [
      packageManager === "yarn" ? "add" : "install",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
      "tw-animate-css",
    ]);
    depsSpinner.succeed("Dependencies installed!");
  } catch (error) {
    depsSpinner.fail("Error installing dependencies");
    console.error(error);
  }

  // Here we apply the base style/theme (Tailwind v4) into the project's globals.css
  try {
    const styleItem = await getRegistryComponent("style", componentsJson);
    await applyRegistryStyleToProject(styleItem, componentsJson, {
      overwriteCssVars: pittayaJson.theme?.overwriteCssVars ?? true,
    });
  } catch (error) {
    // Non-fatal: project can still proceed, but may render without theme. 
    console.error(error);
  }

  console.log(chalk.green(`\n✅ ${chalk.hex(pittayaColorHex)("Pittaya")} UI configured successfully!\n`));
  console.log(chalk.dim("Next steps:"));
  console.log(
    chalk.dim(
      `  ${chalk.bold("npx pittaya add button")} - Add a component`
    )
  );
  console.log(
    chalk.dim(
      `  ${chalk.bold("npx pittaya add --all")} - Add all components\n`
    )
  );
}
