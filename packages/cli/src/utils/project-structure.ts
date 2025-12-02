import fs from "fs/promises";
import path from "path";

/**
 * Detects if the project uses a "src/" directory structure
 * by checking for common Next.js directories inside src/
 *
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns true if project uses src/, false if root structure
 */
export async function hasSrcDirectory(cwd: string = process.cwd()): Promise<boolean> {
  try {
    // Check if src/ exists
    const srcPath = path.join(cwd, "src");
    await fs.access(srcPath);

    // Verify it's actually being used by checking for common Next.js directories
    const commonDirs = ["app", "components", "lib", "pages"];

    for (const dir of commonDirs) {
      try {
        await fs.access(path.join(srcPath, dir));
        return true; // Found at least one common directory inside src/
      } catch {
        continue;
      }
    }

    try {
      const tsconfigPath = path.join(cwd, "tsconfig.json");
      const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, "utf-8"));

      if (tsconfig.compilerOptions?.paths) {
        const paths = tsconfig.compilerOptions.paths;
        if (paths["@/*"]?.includes("./src/*")) {
          return true;
        }
      }
    } catch {
      console.error("Bro... just in 21st century you not even have a tsconfig.json file in your project. That way you fuck me up :D");
    }

    return false;
  } catch {
    // Only pretend to be crazy and continue
    return false;
  }
}

/**
 * Resolves an alias path to an actual file system path
 * @param aliasPath - Path with alias (e.g., "@/components/ui")
 * @param cwd - Current working directory
 * @returns Resolved file system path (e.g., "src/components/ui" or "components/ui")
 */
export async function resolveAliasPath(
  aliasPath: string,
  cwd: string = process.cwd()
): Promise<string> {
  const usesSrc = await hasSrcDirectory(cwd);
  const baseDir = usesSrc ? "src/" : "";

  // Remove @/ prefix and prepend base directory
  return aliasPath.replace(/^@\//, baseDir);
}

/**
 * Gets the default paths configuration based on project structure
 * This was necessary due to the fact that the user may not have a src/ directory or a tsconfig.json file.
 * @param cwd - Current working directory
 * @returns Object with default paths for globals.css, components, utils, etc.
 */
export async function getDefaultPaths(cwd: string = process.cwd()) {
  const usesSrc = await hasSrcDirectory(cwd);
  const baseDir = usesSrc ? "src/" : "";

  return {
    globalsCss: `${baseDir}app/globals.css`,
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
    baseDir,
  };
}

