#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";
import { remove } from "./commands/remove.js";
import { init } from "./commands/init.js";
import { credits } from "./commands/credits.js";
import { diff } from "./commands/diff.js";
import { update } from "./commands/update.js";
import { list } from "./commands/list.js";
import { debug } from "./commands/debug.js";
import { showBanner } from "./utils/banner.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
);

const program = new Command();

program
  .name("pittaya")
  .description("Add Pittaya UI components to your project")
  .version(packageJson.version);

program
  .command("init")
  .description("Initialize Pittaya UI in your project")
  .option("-y, --yes", "Skip confirmations and use default values")
  .action(init);

program
  .command("add")
  .description("Add a component to your project")
  .argument("[components...]", "Component names to add")
  .option("-y, --yes", "Skip confirmations and overwrite existing files")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-a, --all", "Add all available components")
  .option("--add-missing-deps", "Automatically install missing dependencies")
  .action(add);

program
  .command("remove")
  .description("Remove a component from your project")
  .argument("[components...]", "Component names to remove")
  .option("-y, --yes", "Skip confirmation prompts")
  .action(remove);

program
  .command("diff")
  .description("Check for component updates")
  .argument("[components...]", "Component names to check (leave empty for interactive mode)")
  .option("-a, --all", "Check all installed components")
  .action(diff);

program
  .command("update")
  .description("Update components to latest version")
  .argument("[components...]", "Component names to update (leave empty for interactive mode)")
  .option("-a, --all", "Update all installed components")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-f, --force", "Force update even if no changes detected")
  .action(update);

program
  .command("list")
  .description("List available and installed components")
  .option("--installed", "Show only installed components")
  .option("--available", "Show only available components")
  .option("--json", "Output in JSON format")
  .action(list);

program
  .command("credits")
  .description("Show Pittaya UI creators")
  .action(credits);

program
  .command("banner")
  .description("Show the amazing Pittaya banner")
  .action(showBanner);

program
  .command("debug")
  .description("Debug component installation issues")
  .option("-c, --component <name>", "Component name to debug")
  .action(debug);

async function run() {
  const args = process.argv.slice(2);
  const isHelpOrVersion = args.some(arg => ["--help", "-h", "--version", "-v"].includes(arg));
  const isInitCommand = args.length > 0 && args[0] === "init";
  const isCreditsCommand = args.length > 0 && args[0] === "credits";
  
  if (isInitCommand || isCreditsCommand) {
    await showBanner();
  }
  
  program.parse();
}

run();

