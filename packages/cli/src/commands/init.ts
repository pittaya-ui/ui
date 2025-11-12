import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { execa } from "execa";

interface InitOptions {
  yes?: boolean;
}

export async function init(options: InitOptions) {
  console.log(chalk.bold("\nWelcome to Pittaya UI!\n"));

  const cwd = process.cwd();
  const componentsJsonPath = path.join(cwd, "components.json");

  const exists = await fs
    .access(componentsJsonPath)
    .then(() => true)
    .catch(() => false);

  if (exists && !options.yes) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "components.json already exists. Do you want to overwrite it?",
      initial: false,
    });

    if (!overwrite) {
      console.log(chalk.yellow("\n❌ Operation cancelled.\n"));
      return;
    }
  }

  const config = options.yes
    ? getDefaultConfig()
    : await prompts([
        {
          type: "select",
          name: "style",
          message: "Which style would you like to use?",
          choices: [
            { title: "New York", value: "new-york" },
            { title: "Default", value: "default" },
            { title: "Recife", value: "recife" },
          ],
        },
        {
          type: "text",
          name: "tailwindCss",
          message: "Where is your globals.css file?",
          initial: "src/app/globals.css",
        },
        {
          type: "confirm",
          name: "rsc",
          message: "Use React Server Components?",
          initial: true,
        },
        {
          type: "text",
          name: "componentsPath",
          message: "Path for components?",
          initial: "@/components",
        },
        {
          type: "text",
          name: "utilsPath",
          message: "Path for utils?",
          initial: "@/lib/utils",
        },
      ]);

  if (!config.style && !options.yes) {
    console.log(chalk.yellow("\n❌ Operation cancelled.\n"));
    return;
  }

  const componentsJson = {
    $schema: "https://raw.githubusercontent.com/pittaya-ui/cli/main/registry/schema.json",
    style: config.style || "new-york",
    rsc: config.rsc ?? true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      css: config.tailwindCss || "src/app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: config.componentsPath || "@/components",
      utils: config.utilsPath || "@/lib/utils",
      ui: `${config.componentsPath || "@/components"}/ui`,
      lib: "@/lib",
      hooks: "@/hooks",
    },
    iconLibrary: "lucide",
  };

  const spinner = ora("Creating components.json...").start();
  await fs.writeFile(
    componentsJsonPath,
    JSON.stringify(componentsJson, null, 2)
  );
  spinner.succeed("components.json created successfully!");

  const packageManager = await detectPackageManager();

  const depsSpinner = ora("Installing base dependencies...").start();
  try {
    await execa(packageManager, [
      packageManager === "yarn" ? "add" : "install",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ]);
    depsSpinner.succeed("Dependencies installed!");
  } catch (error) {
    depsSpinner.fail("Error installing dependencies");
    console.error(error);
  }

  console.log(chalk.green("\n✅ Pittaya UI configured successfully!\n"));
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

function getDefaultConfig() {
  return {
    style: "new-york",
    tailwindCss: "src/app/globals.css",
    rsc: true,
    componentsPath: "@/components",
    utilsPath: "@/lib/utils",
  };
}

async function detectPackageManager(): Promise<string> {
  try {
    await fs.access("pnpm-lock.yaml");
    return "pnpm";
  } catch {}

  try {
    await fs.access("yarn.lock");
    return "yarn";
  } catch {}

  return "npm";
}

