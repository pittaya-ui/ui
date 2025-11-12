#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { credits } from "./commands/credits.js";

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
  .action(add);

program
  .command("credits")
  .description("Show Pittaya UI creators")
  .action(credits);

program.parse();

