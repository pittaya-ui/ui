#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { credits } from "./commands/credits.js";
import { diff } from "./commands/diff.js";
import { update } from "./commands/update.js";

const program = new Command();

program
  .name("pittaya")
  .description("Add Pittaya UI components to your project")
  .version("0.0.1");

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
  .command("credits")
  .description("Show Pittaya UI creators")
  .action(credits);

program.parse();

