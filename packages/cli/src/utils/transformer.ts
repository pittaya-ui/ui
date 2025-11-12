

import { IConfig } from "../interfaces/IConfig";

export function transformImports(content: string, config: IConfig): string {
  let transformed = content;

  const aliasMap: Record<string, string> = {
    "@/components/ui": config.aliases.ui,
    "@/components": config.aliases.components,
    "@/lib/utils": config.aliases.utils,
    "@/lib": config.aliases.lib,
    "@/hooks": config.aliases.hooks,
  };

  const sortedAliases = Object.entries(aliasMap).sort(
    ([a], [b]) => b.length - a.length
  );

  for (const [from, to] of sortedAliases) {
    if (from !== to) {
      transformed = transformed.replace(
        new RegExp(`from ["']${escapeRegex(from)}`, "g"),
        `from "${to}`
      );
      transformed = transformed.replace(
        new RegExp(`import ["']${escapeRegex(from)}`, "g"),
        `import "${to}`
      );
    }
  }

  return transformed;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

