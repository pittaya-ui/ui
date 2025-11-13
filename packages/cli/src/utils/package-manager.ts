import fs from "fs/promises";
import path from "path";

export async function detectPackageManager(): Promise<string> {
  try {
    await fs.access("pnpm-lock.yaml");
    return "pnpm";
  } catch {}

  try {
    await fs.access("yarn.lock");
    return "yarn";
  } catch {}

  try {
    await fs.access("bun.lockb");
    return "bun";
  } catch {}

  return "npm";
}

export async function isPackageInstalled(packageName: string): Promise<boolean> {
  const cwd = process.cwd();

  try {
    const packageJsonPath = path.join(cwd, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (allDeps[packageName]) {
      return true;
    }
  } catch {}

  try {
    const packagePath = path.join(cwd, "node_modules", packageName);
    await fs.access(packagePath);
    return true;
  } catch {}

  return false;
}

export async function checkMissingDependencies(
  dependencies: string[]
): Promise<string[]> {
  const missing: string[] = [];

  for (const dep of dependencies) {
    const installed = await isPackageInstalled(dep);
    if (!installed) {
      missing.push(dep);
    }
  }

  return missing;
}

