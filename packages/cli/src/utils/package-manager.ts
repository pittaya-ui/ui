import fs from "fs/promises";

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

