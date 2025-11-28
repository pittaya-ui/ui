import path from "path";
import fs from "fs/promises";
import { getRegistryComponent } from "./registry.js";
import { IConfig } from "../interfaces/IConfig.js";
import { IRegistryComponent } from "../interfaces/IRegistryComponent.js";

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
    const component: IRegistryComponent = await getRegistryComponent(name);
    if (!component) return false;

    for (const file of component.files) {
      const targetPath = resolveTargetPath(file.name, component.type, config);
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
export function resolveTargetPath(
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

