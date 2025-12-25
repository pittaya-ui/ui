import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Project } from "ts-morph";
import { IRegistryComponent } from "../packages/cli/src/interfaces/IRegistryComponent";
import { IIndexComponent } from "../packages/cli/src/interfaces/IIndexComponent";
import { IComponentIndexItem } from "../packages/cli/src/interfaces/IComponentIndexItem";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getCliArgValue(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) return undefined;
  return value;
}

function normalizeUiKitBranch(value: string | undefined): string {
  const normalized = (value || "main").trim().toLowerCase();
  return normalized.length > 0 ? normalized : "main";
}

const UI_KIT_BRANCH = normalizeUiKitBranch(
  getCliArgValue("--ui-branch") || process.env.UI_KIT_BRANCH
);

const GITHUB_REPO = `https://raw.githubusercontent.com/pittaya-ui/ui-kit/${UI_KIT_BRANCH}`;
const UI_COMPONENTS_INDEX_URL = `${GITHUB_REPO}/src/lib/docs/components-index.ts`;
const UI_LIBRARIES_INDEX_URL = `${GITHUB_REPO}/src/lib/docs/libraries-index.ts`;
const UI_COMPONENTS_BASE_URL = `${GITHUB_REPO}/src/components/ui`;
const UI_LIB_BASE_URL = `${GITHUB_REPO}/src/lib`;

const UI_COMPONENTS_DIR = path.join(__dirname, "../../ui/src/components/ui");
const UI_LIB_DIR = path.join(__dirname, "../../ui/src/lib");
const UI_COMPONENTS_INDEX = path.join(__dirname, "../../ui/src/lib/docs/components-index.ts");
const UI_LIBRARIES_INDEX = path.join(__dirname, "../../ui/src/lib/docs/libraries-index.ts");
const UI_GLOBALS_CSS = path.join(__dirname, "../../ui/src/app/globals.css");

const REGISTRY_DIR = path.join(__dirname, "../registry");
const REGISTRY_STYLES_DIR = path.join(REGISTRY_DIR, "styles");

const USE_GITHUB = process.env.USE_LOCAL_UI !== "true";

async function fetchFromGitHub(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`❌ Erro ao buscar ${url}:`, error);
    return null;
  }
}

async function publishRegistryToStyles(
  componentsIndex: IIndexComponent[],
  componentsByName: Map<string, IRegistryComponent>,
  styleCssVars: {
    theme: Record<string, string>;
    light: Record<string, string>;
    dark: Record<string, string>;
  }
) {
  const defaultStyles = ["new-york", "default", "pittaya"];

  function cloneRegistryComponent(component: IRegistryComponent): IRegistryComponent {
    return JSON.parse(JSON.stringify(component)) as IRegistryComponent;
  }

  function applyCssVarsForStyle(
    styleName: string,
    baseCssVars: {
      theme: Record<string, string>;
      light: Record<string, string>;
      dark: Record<string, string>;
    }
  ) {
    if (styleName !== "pittaya") return baseCssVars;

    const out = {
      theme: { ...baseCssVars.theme },
      light: { ...baseCssVars.light },
      dark: { ...baseCssVars.dark },
    };

    const pittayaLight = out.light.pittaya;
    const pittayaDark = out.dark.pittaya;

    out.light.radius = "1rem";
    if (pittayaLight) {
      out.light.primary = pittayaLight;
    }

    if (pittayaDark) {
      out.dark.primary = pittayaDark;
      out.dark["primary-foreground"] = "oklch(0.145 0 0)";
    }

    return out;
  }

  function applyStyleOverridesToContent(
    styleName: string,
    componentName: string,
    content: string
  ) {
    if (componentName === "button") {
      const oldBaseClass =
        "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

      if (styleName === "default") {
        content = content
          .replace(
            oldBaseClass,
            "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0"
          )
          .replace(
            "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            "bg-primary text-primary-foreground hover:bg-primary/90"
          )
          .replace(
            "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            "bg-destructive text-white hover:bg-destructive/90"
          )
          .replace(
            "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            "border bg-background hover:bg-accent hover:text-accent-foreground"
          )
          .replace(
            "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )
          .replace(
            "dark:hover:bg-accent/50",
            ""
          )
          .replace(
            "default: \"h-9 px-4 py-2 has-[>svg]:px-3\"",
            "default: \"h-10 px-4 py-2 has-[>svg]:px-3\""
          )
          .replace(
            "sm: \"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5\"",
            "sm: \"h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5\""
          )
          .replace(
            "lg: \"h-10 rounded-md px-6 has-[>svg]:px-4\"",
            "lg: \"h-11 rounded-md px-6 has-[>svg]:px-4\""
          )
          .replace("icon: \"size-9\"", "icon: \"size-10\"");
      }

      if (styleName === "new-york") {
        content = content
          .replace(
            oldBaseClass,
            "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0"
          )
          .replace(
            "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            "bg-primary text-primary-foreground shadow hover:bg-primary/90"
          )
          .replace(
            "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            "bg-destructive text-white shadow-sm hover:bg-destructive/90"
          )
          .replace(
            "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            "border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          )
          .replace(
            "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
          )
          .replace(
            "dark:hover:bg-accent/50",
            ""
          )
          .replace(
            "sm: \"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5\"",
            "sm: \"h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5\""
          );
      }
    }

    if (componentName === "card") {
      if (styleName === "default") {
        content = content
          .replace(
            "bg-card text-card-foreground border shadow-sm flex flex-col gap-6 p-6",
            "bg-card text-card-foreground border shadow-sm flex flex-col gap-6 p-6"
          )
          .replace(
            "default: \"rounded-xl border shadow-sm\"",
            "default: \"rounded-lg border shadow-sm\""
          )
          .replace(
            "className={cn(\"leading-tight font-semibold\", className)}",
            "className={cn(\"text-2xl font-semibold leading-none tracking-tight\", className)}"
          );
      }

      if (styleName === "new-york") {
        content = content
          .replace(
            "bg-card text-card-foreground border shadow-sm flex flex-col gap-6 p-6",
            "bg-card text-card-foreground border shadow flex flex-col gap-6 p-6"
          )
          .replace(
            "default: \"rounded-xl border shadow-sm\"",
            "default: \"rounded-xl border shadow\""
          )
          .replace(
            "className={cn(\"leading-tight font-semibold\", className)}",
            "className={cn(\"font-semibold leading-none tracking-tight\", className)}"
          );
      }
    }

    if (componentName === "tabs") {
      if (styleName === "default") {
        content = content
          .replace(
            "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
            "bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-md p-1"
          )
          .replace("rounded-md border border-transparent px-2 py-1", "rounded-sm border border-transparent px-3 py-1.5");
      }

      if (styleName === "new-york") {
        content = content.replace(
          "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
          "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1"
        );
      }
    }

    if (componentName === "carousel") {
      if (styleName === "default") {
        content = content
          .replace("overflow-hidden rounded-2xl", "overflow-hidden rounded-lg")
          .replaceAll("shadow-lg hover:shadow-xl", "shadow-sm")
          .replaceAll("backdrop-blur-md", "backdrop-blur-sm")
          .replaceAll("border-2", "border");
      }

      if (styleName === "new-york") {
        content = content
          .replace("overflow-hidden rounded-2xl", "overflow-hidden rounded-xl")
          .replace("backdrop-blur-md", "backdrop-blur-md")
          .replace("border-2", "border-2");
      }
    }

    if (componentName === "announcement-badge") {
      if (styleName === "default") {
        content = content.replace(
          "shadow-sm hover:shadow-md transition-shadow ",
          ""
        );
      }

      if (styleName === "new-york") {
        content = content.replace(
          "shadow-sm hover:shadow-md transition-shadow ",
          "shadow hover:shadow-md transition-shadow "
        );
      }
    }

    if (componentName === "installation-section") {
      if (styleName === "default") {
        content = content
          .replace(
            "border-border bg-card/60 w-full rounded-lg border",
            "border-border bg-card/60 w-full rounded-md border"
          );
      }

      if (styleName === "new-york") {
        content = content
          .replace(
            "border-border bg-card/60 w-full rounded-lg border",
            "border-border bg-card/60 w-full rounded-xl border shadow"
          )
          .replace("<TabsList className=\"bg-card/60\">", "<TabsList className=\"bg-card/80\">");
      }
    }

    if (componentName === "orbit-images") {
      if (styleName === "default") {
        content = content
          .replace("rounded-xl border-2 border-white shadow-lg", "rounded-lg border border-white shadow-sm")
          .replace("sm:rounded-2xl sm:border-4", "sm:rounded-xl sm:border-2")
          .replaceAll("shadow-lg", "shadow-sm");
      }

      if (styleName === "new-york") {
        content = content
          .replace("rounded-xl border-2 border-white shadow-lg", "rounded-xl border-2 border-white shadow-lg")
          .replace("sm:rounded-2xl sm:border-4", "sm:rounded-2xl sm:border-4")
          .replace("shadow-lg", "shadow-lg");
      }
    }

    return content;
  }

  function applyStyleOverridesToComponent(
    styleName: string,
    component: IRegistryComponent
  ) {
    const out = cloneRegistryComponent(component);
    if (!out.files || out.files.length === 0) return out;

    out.files = out.files.map((f) => {
      if (!f?.content) return f;
      return {
        ...f,
        content: applyStyleOverridesToContent(styleName, out.name, f.content),
      };
    });

    return out;
  }

  let styleDirEntries: string[];
  try {
    const entries = await fs.readdir(REGISTRY_STYLES_DIR, {
      withFileTypes: true,
    });
    styleDirEntries = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    styleDirEntries = [];
  }

  const styleSet = new Set<string>(defaultStyles);
  for (const styleName of styleDirEntries) {
    styleSet.add(styleName);
  }
  styleDirEntries = Array.from(styleSet);

  for (const styleName of styleDirEntries) {
    const stylePath = path.join(REGISTRY_STYLES_DIR, styleName);
    const styleIndexPath = path.join(stylePath, "index.json");
    const styleComponentsDir = path.join(stylePath, "components");

    await fs.mkdir(stylePath, { recursive: true });
    await fs.rm(styleComponentsDir, { recursive: true, force: true });
    await fs.mkdir(styleComponentsDir, { recursive: true });

    const styleIndex: {
      $schema: string;
      version: string;
      components: IIndexComponent[];
    } = {
      $schema: "../../schema.json",
      version: "0.0.1",
      components: [],
    };

    styleIndex.components.push({
      name: "style",
      type: "registry:style",
      files: ["style"],
      category: "Style",
      description: `Base style (${styleName})`,
    });

    for (const comp of componentsIndex) {
      if (!comp?.name) continue;
      styleIndex.components.push({
        name: comp.name,
        type: comp.type,
        files: comp.files,
        category: comp.category,
        description: comp.description,
      });
    }

    const styleComponent: IRegistryComponent = {
      name: "style",
      type: "registry:style",
      description: `Base style (${styleName})`,
      cssVars: applyCssVarsForStyle(styleName, styleCssVars),
      files: [],
    };

    await fs.writeFile(
      path.join(styleComponentsDir, "style.json"),
      JSON.stringify(styleComponent, null, 2)
    );

    for (const comp of componentsIndex) {
      if (!comp?.name) continue;

      const outPath = path.join(styleComponentsDir, `${comp.name}.json`);
      const payload = componentsByName.get(comp.name);
      if (!payload) continue;

      const styledPayload = applyStyleOverridesToComponent(styleName, payload);
      await fs.writeFile(outPath, JSON.stringify(styledPayload, null, 2));
    }

    await fs.writeFile(styleIndexPath, JSON.stringify(styleIndex, null, 2));
  }
}

function parseCssVarsBlock(content: string, selector: string) {
  let startMatch: RegExpMatchArray | null = null;

  if (selector === "@theme inline") {
    startMatch = content.match(/@theme\s+inline\s*\{/);
  } else if (selector === ":root") {
    startMatch = content.match(/(^|\n)\s*:root\s*\{/);
  } else if (selector === ".dark") {
    startMatch = content.match(/(^|\n)\s*\.dark\s*\{/);
  } else {
    startMatch = content.match(new RegExp(`${selector}\\s*\\{`));
  }

  if (!startMatch || typeof startMatch.index !== "number") return {};

  const open = content.indexOf("{", startMatch.index);
  if (open === -1) return {};

  let depth = 1;
  let i = open + 1;
  for (; i < content.length; i++) {
    const ch = content[i];
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth === 0) break;
  }

  if (i >= content.length) return {};

  const block = content.slice(open + 1, i);
  const vars: Record<string, string> = {};

  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("--")) continue;
    const match = trimmed.match(/^--([A-Za-z0-9_-]+)\s*:\s*(.+?)\s*;?\s*$/);
    if (!match) continue;
    const key = match[1];
    const value = match[2].trim().replace(/\s*\/\*.*\*\/\s*$/, "");
    vars[key] = value;
  }

  return vars;
}

async function extractCssVarsFromGlobalsCss() {
  const raw = await fs.readFile(UI_GLOBALS_CSS, "utf-8").catch(() => "");
  if (!raw) {
    return { theme: {}, light: {}, dark: {} };
  }

  return {
    theme: parseCssVarsBlock(raw, "@theme inline"),
    light: parseCssVarsBlock(raw, ":root"),
    dark: parseCssVarsBlock(raw, ".dark"),
  };
}

async function getOfficialComponents(): Promise<IComponentIndexItem[]> {
  const components: IComponentIndexItem[] = [];

  if (USE_GITHUB) {
    console.log("🌐 Fetching components list from GitHub...");

    const componentsContent = await fetchFromGitHub(UI_COMPONENTS_INDEX_URL);
    if (componentsContent) {
      const componentItems = parseComponentsIndex(componentsContent);
      components.push(...componentItems);

      console.log(`   ✅ ${componentItems.length} UI components found`);
    }

    const librariesContent = await fetchFromGitHub(UI_LIBRARIES_INDEX_URL);
    if (librariesContent) {
      const libraryItems = parseComponentsIndex(librariesContent);
      components.push(...libraryItems);
      console.log(`   ✅ ${libraryItems.length} libraries found`);
    }

    if (components.length > 0) {
      console.log(`   📦 Total: ${components.length} items\n`);
      return components;
    }

    console.log("   ⚠️  Failed to fetch from GitHub, trying local...\n");
  }

  try {
    const componentsContent = await fs.readFile(UI_COMPONENTS_INDEX, "utf-8");
    const componentItems = parseComponentsIndex(componentsContent);
    components.push(...componentItems);
    console.log(`   ✅ ${componentItems.length} UI components found (local)`);

    try {
      const librariesContent = await fs.readFile(UI_LIBRARIES_INDEX, "utf-8");
      const libraryItems = parseComponentsIndex(librariesContent);
      components.push(...libraryItems);
      console.log(`   ✅ ${libraryItems.length} libraries found (local)`);
    } catch {
      console.log(`   ⚠️  libraries-index.ts not found (local)`);
    }

    console.log(`   📦 Total: ${components.length} items\n`);
    return components;
  } catch {
    console.log("⚠️  No component source available\n");
    return [];
  }
}

function parseComponentsIndex(content: string): IComponentIndexItem[] {
  const items: IComponentIndexItem[] = [];

  const blockRegex = /\{[^}]*slug:\s*["']([^"']+)["'][^}]*\}/gs;

  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const block = match[0];

    const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);
    const descMatch = block.match(/description:\s*["']([^"']+)["']/);
    const categoryMatch = block.match(/category:\s*["']([^"']+)["']/);
    const depsMatch = block.match(/dependencies:\s*\[(.*?)\]/s);
    const internalDepsMatch = block.match(/internalDependencies:\s*\[(.*?)\]/s);

    if (slugMatch && descMatch && categoryMatch) {
      const item: IComponentIndexItem = {
        slug: slugMatch[1],
        description: descMatch[1],
        category: categoryMatch[1],
      };

      if (depsMatch) {
        const depsString = depsMatch[1];
        const deps = depsString
          .match(/["']([^"']+)["']/g)
          ?.map(d => d.replace(/["']/g, '')) || [];

        if (deps.length > 0) {
          item.dependencies = deps;
        }
      }

      if (internalDepsMatch) {
        const internalDepsString = internalDepsMatch[1];
        const internalDeps = internalDepsString
          .match(/["']([^"']+)["']/g)
          ?.map(d => d.replace(/["']/g, '')) || [];

        if (internalDeps.length > 0) {
          item.internalDependencies = internalDeps;
        }
      }

      items.push(item);
    }
  }

  return items;
}

async function getComponentContent(name: string, category: string): Promise<string | null> {
  const isLibrary = category === "Library";

  if (USE_GITHUB) {
    const baseUrl = isLibrary ? UI_LIB_BASE_URL : UI_COMPONENTS_BASE_URL;

    let content = await fetchFromGitHub(`${baseUrl}/${name}.tsx`);
    if (content) return content;

    content = await fetchFromGitHub(`${baseUrl}/${name}.ts`);
    if (content) return content;

    console.log(`   ⚠️  ${name} não encontrado no GitHub`);
  }

  const baseDir = isLibrary ? UI_LIB_DIR : UI_COMPONENTS_DIR;

  try {
    const tsxPath = path.join(baseDir, `${name}.tsx`);
    return await fs.readFile(tsxPath, "utf-8");
  } catch {
    try {
      const tsPath = path.join(baseDir, `${name}.ts`);
      return await fs.readFile(tsPath, "utf-8");
    } catch {
      return null;
    }
  }
}


async function buildRegistry() {
  console.log("🔨 Generating Pittaya UI registry ..\n");

  if (USE_GITHUB) {
    console.log("🌐 GitHub Raw CDN mode");
    console.log(`   📌 ui-kit branch: ${UI_KIT_BRANCH}`);
  } else {
    console.log("💻 Local mode (../../ui)");
  }
  console.log("");

  const index: {
    $schema: string;
    version: string;
    components: IIndexComponent[];
  } = {
    $schema: "./schema.json",
    version: "0.0.1",
    components: [],
  };

  const componentsByName = new Map<string, IRegistryComponent>();

  const officialComponents = await getOfficialComponents();

  if (officialComponents.length === 0) {
    console.log("⚠️  No components found. Creating empty registry...\n");
    await fs.writeFile(
      path.join(REGISTRY_DIR, "index.json"),
      JSON.stringify(index, null, 2)
    );
    console.log("✅ Empty registry created!");
    return;
  }

  const componentNames = officialComponents.map(c => c.slug).join(", ");
  console.log(`📋 Components to process: ${componentNames}\n`);
  console.log("📦 Processing components...");

  for (const item of officialComponents) {
    const { slug: componentName, description, category, dependencies: indexDependencies, internalDependencies } = item;
    const isLibrary = category === "Library";
    const content = await getComponentContent(componentName, category);

    if (!content) {
      console.log(`   ❌ ${componentName} - not found`);
      continue;
    }

    console.log(`   ✓ ${componentName} ${isLibrary ? "(lib)" : "(ui)"}`);

    const hasReactImport = /from ['"]react['"]/.test(content);
    const hasJSX = /<[A-Z][a-zA-Z]*/.test(content) || /<(div|span|button|input|form|img|a|p|h[1-6])/.test(content);
    const isUIComponent = !isLibrary;

    const fileExtension = (hasReactImport || hasJSX || isUIComponent) ? ".tsx" : ".ts";
    const fileName = `${componentName}${fileExtension}`;

    // Always auto-detect dependencies from code
    const dependencies = new Set<string>();

    if (componentName === "utils") {
      dependencies.add("clsx");
      dependencies.add("tailwind-merge");
    } else if (!isLibrary) {
      const extracted = extractNpmDependencies(content);
      extracted.forEach(dep => dependencies.add(dep));
    }

    // Merge with manual declarations (for edge cases)
    if (indexDependencies && indexDependencies.length > 0) {
      indexDependencies.forEach(dep => dependencies.add(dep));
    }

    const finalDependencies = Array.from(dependencies).sort();

    // Extract dependencies using AST analysis (detects absolute and relative imports)
    const registryDepsFromContent = isLibrary
      ? []
      : extractRegistryDependenciesWithAST(content, componentName, isLibrary);
    const registryDeps = new Set<string>(registryDepsFromContent);

    // Process internalDependencies declared manually
    if (internalDependencies && internalDependencies.length > 0) {
      const autoDetected: string[] = [];
      const manualOnly: string[] = [];

      internalDependencies.forEach(dep => {
        if (registryDepsFromContent.includes(dep)) {
          autoDetected.push(dep);
        } else {
          manualOnly.push(dep);
        }
        registryDeps.add(dep);
      });

      if (autoDetected.length > 0) {
        console.log(`     ℹ️  Auto-detected: ${autoDetected.join(", ")} (internalDependencies not needed)`);
      }
      if (manualOnly.length > 0) {
        console.log(`     ✓ Manual override: ${manualOnly.join(", ")}`);
      }
    }

    const component: IRegistryComponent = {
      name: componentName,
      type: isLibrary ? "registry:lib" : "registry:ui",
      description,
      dependencies: finalDependencies.length > 0 ? finalDependencies : undefined,
      registryDependencies: registryDeps.size > 0 ? Array.from(registryDeps).sort() : undefined,
      files: [
        {
          name: fileName,
          content,
        },
      ],
    };

    componentsByName.set(componentName, component);

    index.components.push({
      name: componentName,
      type: isLibrary ? "registry:lib" : "registry:ui",
      files: [componentName],
      category: category,
      description: component.description,
    });
  }

  const styleCssVars = await extractCssVarsFromGlobalsCss();
  await publishRegistryToStyles(index.components, componentsByName, styleCssVars);

  console.log(`\n✅ Registry generated with ${index.components.length} components!`);
  console.log(`📁 Location: ${REGISTRY_DIR}`);

  // Validate dependencies after building
  console.log(`\n🔍 Validating dependencies...`);
  await validateDependencies();

  console.log(
    `\n💡 Next step: Commit and push to GitHub to make it available via CDN\n`
  );
}

async function validateDependencies() {
  try {
    const styleDirs = await fs
      .readdir(REGISTRY_STYLES_DIR, { withFileTypes: true })
      .then((entries) => entries.filter((e) => e.isDirectory()).map((e) => e.name))
      .catch(() => [] as string[]);

    const jsonFiles: Array<{ style: string; file: string }> = [];
    for (const styleName of styleDirs) {
      const styleComponentsDir = path.join(REGISTRY_STYLES_DIR, styleName, "components");
      const files = await fs.readdir(styleComponentsDir).catch(() => [] as string[]);
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        jsonFiles.push({ style: styleName, file });
      }
    }

    let hasErrors = false;

    for (const { style, file } of jsonFiles) {
      const filePath = path.join(REGISTRY_STYLES_DIR, style, "components", file);
      const content = await fs.readFile(filePath, "utf-8");
      const component: IRegistryComponent = JSON.parse(content);

      if (!component.files || component.files.length === 0) continue;

      const codeContent = component.files[0].content;
      const detectedDeps = extractNpmDependencies(codeContent);
      const declaredDeps = component.dependencies || [];
      const missing = detectedDeps.filter(dep => !declaredDeps.includes(dep));

      if (missing.length > 0) {
        hasErrors = true;
        console.log(
          `   ⚠️  ${component.name} (${style}): missing [${missing.join(", ")}]`
        );
      }
    }

    if (hasErrors) {
      console.log(`   ❌ Some components have missing dependencies!`);
      console.log(`   💡 Run: npm run validate:deps for details`);
    } else {
      console.log(`   ✅ All dependencies are correctly declared`);
    }
  } catch (error) {
    console.log(`   ⚠️  Validation skipped (error: ${error})`);
  }
}

function extractNpmDependencies(content: string): string[] {
  const deps = new Set<string>();

  const importRegex = /from\s+["']([^@.\/][^"']+)["']/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const pkg = match[1].split("/")[0];
    if (pkg && pkg !== "react" && pkg !== "react-dom" && pkg !== "next") {
      deps.add(pkg);
    }
  }

  return Array.from(deps).sort();
}

/**
 * Extrai dependências internas usando análise AST do TypeScript
 * Detecta imports absolutos (@/components/ui/*, @/lib/*) e relativos (./*, ../*)
 */
function extractRegistryDependenciesWithAST(
  content: string,
  componentName: string,
  isLibrary: boolean
): string[] {
  const deps = new Set<string>();

  try {
    // Create a virtual ts-morph project for AST analysis
    const project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        target: 99, // Latest
        jsx: 2, // React
      },
    });

    // Add the virtual file
    const sourceFile = project.createSourceFile(
      `${componentName}.tsx`,
      content
    );

    const importDeclarations = sourceFile.getImportDeclarations();

    for (const importDecl of importDeclarations) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      // 1. Detect absolute imports from @/lib/utils
      if (moduleSpecifier === "@/lib/utils" || moduleSpecifier.startsWith("@/lib/utils/")) {
        deps.add("utils");
      }

      // 2. Detect imports from @/components/ui/*
      if (moduleSpecifier.startsWith("@/components/ui/")) {
        const componentName = moduleSpecifier.replace("@/components/ui/", "");
        if (componentName && !componentName.includes("/")) {
          deps.add(componentName);
        }
      }

      // 3. Detect relative imports (./* and ../*)
      if (moduleSpecifier.startsWith("./") || moduleSpecifier.startsWith("../")) {
        const resolvedName = extractComponentNameFromRelativePath(
          moduleSpecifier,
          componentName,
          isLibrary
        );
        if (resolvedName) {
          deps.add(resolvedName);
        }
      }
    }
  } catch (error) {
    // Fallback to regex if AST fails
    console.log(`   ⚠️  AST analysis failed for ${componentName}, using regex fallback`);
    return extractRegistryDependenciesRegex(content);
  }

  return Array.from(deps).sort();
}

/**
 * Extract component name from a relative path
 * Exemplo: "./button" -> "button", "../ui/card" -> "card"
 */
function extractComponentNameFromRelativePath(
  relativePath: string,
  currentComponent: string,
  isLibrary: boolean
): string | null {
  // Remove extensões (.tsx, .ts, .jsx, .js)
  let cleanPath = relativePath.replace(/\.(tsx?|jsx?)$/, "");

  // Remove ./ ou ../
  cleanPath = cleanPath.replace(/^\.\.?\//, "");

  // Se for um caminho complexo como "../ui/button", pega apenas o nome final
  const parts = cleanPath.split("/");
  const componentName = parts[parts.length - 1];

  // Validação: verifica se é um nome de componente válido
  // (não é index, types, constants, helpers, etc.)
  const invalidNames = ["index", "types", "constants", "helpers", "utils", "hooks"];
  if (invalidNames.includes(componentName)) {
    return null;
  }

  // Se está em um componente de biblioteca e importa algo relativo,
  // probably another component
  if (isLibrary && componentName === "utils") {
    return null; // importing utils from utils doesn't make sense (circular dependency)
  }

  return componentName;
}

/**
 * Fallback: extraction using regex (old method)
 */
function extractRegistryDependenciesRegex(content: string): string[] {
  const deps = new Set<string>();

  if (content.includes("@/lib/utils") || content.includes('from "@/lib/utils"')) {
    deps.add("utils");
  }

  const uiImportRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g;
  let match;

  while ((match = uiImportRegex.exec(content)) !== null) {
    const componentName = match[1];
    if (componentName) {
      deps.add(componentName);
    }
  }

  return Array.from(deps).sort();
}

buildRegistry().catch((error) => {
  console.error("\n❌ Erro ao gerar registry:", error);
  process.exit(1);
});

