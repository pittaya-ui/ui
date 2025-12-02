import chalk from "chalk";
import path from "path";
import fs from "fs/promises";
import { IConfig } from "../interfaces/IConfig";
import { getRegistryComponent } from "../utils/registry.js";
import { resolveTargetPath, isComponentInstalled } from "../utils/component-checker.js";
import { hasSrcDirectory, resolveAliasPath } from "../utils/project-structure.js";

interface DebugOptions {
  component?: string;
}

export async function debug(options: DebugOptions) {
  const cwd = process.cwd();
  const componentsJsonPath = path.join(cwd, "components.json");

  console.log(chalk.bold("\n🔍 Pittaya UI Debug Information\n"));
  console.log(chalk.dim(`Working directory: ${cwd}\n`));

  // Check components.json
  let config: IConfig;
  try {
    const configContent = await fs.readFile(componentsJsonPath, "utf-8");
    config = JSON.parse(configContent);
    console.log(chalk.green("✅ components.json found"));
    console.log(chalk.dim(`   Path: ${componentsJsonPath}`));
  } catch (error) {
    console.log(chalk.red("❌ components.json not found\n"));
    return;
  }

  // Check project structure
  const usesSrc = await hasSrcDirectory(cwd);
  console.log(chalk.green(`✅ Project structure: ${usesSrc ? "src/" : "root"}`));

  // Display aliases
  console.log(chalk.bold("\n📋 Configured Aliases:"));
  console.log(chalk.dim(`   components: ${config.aliases.components}`));
  console.log(chalk.dim(`   utils: ${config.aliases.utils}`));
  console.log(chalk.dim(`   ui: ${config.aliases.ui}`));

  // Resolve aliases to actual paths
  const resolvedUi = await resolveAliasPath(config.aliases.ui, cwd);
  const resolvedLib = await resolveAliasPath(config.aliases.lib || "@/lib", cwd);
  console.log(chalk.bold("\n📂 Resolved Paths:"));
  console.log(chalk.dim(`   UI components: ${resolvedUi}`));
  console.log(chalk.dim(`   Libraries: ${resolvedLib}`));

  // Check if component specified
  if (options.component) {
    console.log(chalk.bold(`\n🔍 Debugging component: ${options.component}\n`));

    try {
      const component = await getRegistryComponent(options.component);

      if (!component) {
        console.log(chalk.red(`❌ Component not found in registry\n`));
        return;
      }

      console.log(chalk.green(`✅ Component found in registry`));
      console.log(chalk.dim(`   Type: ${component.type}`));
      console.log(chalk.dim(`   Files: ${component.files.length}`));

      console.log(chalk.bold("\n📁 Expected Files:"));
      for (const file of component.files) {
        const targetPath = await resolveTargetPath(file.name, component.type, config);
        const fullPath = path.join(cwd, targetPath);

        const exists = await fs.access(fullPath)
          .then(() => true)
          .catch(() => false);

        const statusIcon = exists ? chalk.green("✅") : chalk.red("❌");
        const statusText = exists ? chalk.green("EXISTS") : chalk.red("NOT FOUND");

        console.log(`   ${statusIcon} ${file.name}`);
        console.log(chalk.dim(`      Expected: ${fullPath}`));
        console.log(chalk.dim(`      Status: ${statusText}`));

        if (!exists) {
          // Check if file exists with different name
          const dir = path.dirname(fullPath);
          try {
            const dirExists = await fs.access(dir).then(() => true).catch(() => false);
            if (dirExists) {
              const filesInDir = await fs.readdir(dir);
              const baseName = path.basename(file.name, path.extname(file.name));
              const similarFiles = filesInDir.filter(f =>
                f.includes(baseName) || f.toLowerCase().includes(baseName.toLowerCase())
              );

              if (similarFiles.length > 0) {
                console.log(chalk.yellow(`      💡 Similar files found in directory:`));
                similarFiles.forEach(f => {
                  console.log(chalk.dim(`         - ${f}`));
                });
              }
            } else {
              console.log(chalk.red(`      ⚠️  Directory doesn't exist: ${dir}`));
            }
          } catch (err) {
            // Ignore
          }
        }
      }

      const isInstalled = await isComponentInstalled(options.component, config);
      console.log(chalk.bold(`\n📊 Installation Status:`));
      if (isInstalled) {
        console.log(chalk.green(`   ✅ Component is detected as INSTALLED`));
      } else {
        console.log(chalk.red(`   ❌ Component is detected as NOT INSTALLED`));
        console.log(chalk.yellow(`   💡 All files must exist for component to be considered installed`));
      }

    } catch (error) {
      console.log(chalk.red(`\n❌ Error debugging component:`));
      console.error(error);
    }
  } else {
    console.log(chalk.yellow("\n💡 To debug a specific component, use:"));
    console.log(chalk.dim("   npx pittaya debug --component <name>\n"));
  }
}

