import path from "path";
import fs from "fs/promises";
import { getRegistryComponent } from "./registry.js";
import { IConfig } from "../interfaces/IConfig.js";
import { IRegistryComponent } from "../interfaces/IRegistryComponent.js";
import { resolveAliasPath } from "./project-structure.js";

/**
 * Check if a component is installed in the project
 * @param name - The component name/slug
 * @param config - The project configuration from components.json
 * @returns true if all component files exist, false otherwise
 */
export async function isComponentInstalled(
  name: string,
  config: IConfig
): Promise<boolean> {
  try {
    const component: IRegistryComponent = await getRegistryComponent(name, config);
    if (!component) return false;

    for (const file of component.files) {
      const targetPath = await resolveTargetPath(file.name, component.type, config);
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

/**
 * Resolve the target path for a component file based on its type
 * @param fileName - The file name
 * @param type - The component type (registry:ui, registry:lib, registry:hook)
 * @param config - The project configuration
 * @returns The resolved file path
 */
export async function resolveTargetPath(
  fileName: string,
  type: string,
  config: IConfig
): Promise<string> {
  const normalized = fileName.replace(/\\/g, "/");

  if (type === "registry:ui") {
    const resolvedPath = await resolveAliasPath(config.aliases.ui);
    const relative = normalized.replace(/^ui\//, "");
    return path.join(resolvedPath, relative);
  }

  if (type === "registry:lib") {
    const resolvedPath = await resolveAliasPath(config.aliases.lib);
    const relative = normalized.replace(/^lib\//, "");
    return path.join(resolvedPath, relative);
  }

  if (type === "registry:hook") {
    const resolvedPath = await resolveAliasPath(config.aliases.hooks);
    return path.join(resolvedPath, fileName);
  }

  return fileName;
}

