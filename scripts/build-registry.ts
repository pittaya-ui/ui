import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { IRegistryComponent } from "../packages/cli/src/interfaces/IRegistryComponent";
import { IIndexComponent } from "../packages/cli/src/interfaces/IIndexComponent";
import { IComponentIndexItem } from "../packages/cli/src/interfaces/IComponentIndexItem";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GITHUB_REPO = "https://raw.githubusercontent.com/pittaya-ui/ui-kit/main";
const UI_COMPONENTS_INDEX_URL = `${GITHUB_REPO}/src/lib/docs/components-index.ts`;
const UI_LIBRARIES_INDEX_URL = `${GITHUB_REPO}/src/lib/docs/libraries-index.ts`;
const UI_COMPONENTS_BASE_URL = `${GITHUB_REPO}/src/components/ui`;
const UI_LIB_BASE_URL = `${GITHUB_REPO}/src/lib`;

const UI_COMPONENTS_DIR = path.join(__dirname, "../../ui/src/components/ui");
const UI_LIB_DIR = path.join(__dirname, "../../ui/src/lib");
const UI_COMPONENTS_INDEX = path.join(__dirname, "../../ui/src/lib/docs/components-index.ts");
const UI_LIBRARIES_INDEX = path.join(__dirname, "../../ui/src/lib/docs/libraries-index.ts");

const REGISTRY_DIR = path.join(__dirname, "../registry");
const REGISTRY_COMPONENTS_DIR = path.join(REGISTRY_DIR, "components");

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
  } else {
    console.log("💻 Local mode (../../ui)");
  }
  console.log("");

  await fs.mkdir(REGISTRY_COMPONENTS_DIR, { recursive: true });

  const index: {
    $schema: string;
    version: string;
    components: IIndexComponent[];
  } = {
    $schema: "./schema.json",
    version: "0.0.1",
    components: [],
  };

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

    const fileExtension = content.includes("React") || content.includes("jsx") ? ".tsx" : ".ts";
    const fileName = `${componentName}${fileExtension}`;

    const dependencies: string[] = [];

    if (indexDependencies && indexDependencies.length > 0) {
      dependencies.push(...indexDependencies);
    } else if (componentName === "utils") {
      dependencies.push("clsx", "tailwind-merge");
    } else if (!isLibrary) {
      const extracted = extractNpmDependencies(content);
      if (extracted) dependencies.push(...extracted);
    }

    const registryDepsFromContent = isLibrary ? [] : extractRegistryDependencies(content);
    const registryDeps = new Set<string>(registryDepsFromContent);

    if (internalDependencies && internalDependencies.length > 0) {
      internalDependencies.forEach(dep => registryDeps.add(dep));
    }

    const component: IRegistryComponent = {
      name: componentName,
      type: isLibrary ? "registry:lib" : "registry:ui",
      description,
      dependencies: dependencies.length > 0 ? dependencies : undefined,
      registryDependencies: registryDeps.size > 0 ? Array.from(registryDeps).sort() : undefined,
      files: [
        {
          name: fileName,
          content,
        },
      ],
    };

    await fs.writeFile(
      path.join(REGISTRY_COMPONENTS_DIR, `${componentName}.json`),
      JSON.stringify(component, null, 2)
    );

    index.components.push({
      name: componentName,
      type: isLibrary ? "registry:lib" : "registry:ui",
      files: [componentName],
      category: category,
      description: component.description,
    });
  }

  await fs.writeFile(
    path.join(REGISTRY_DIR, "index.json"),
    JSON.stringify(index, null, 2)
  );

  console.log(`\n✅ Registry generated with ${index.components.length} components!`);
  console.log(`📁 Location: ${REGISTRY_DIR}`);
  console.log(
    `\n💡 Next step: Commit and push to GitHub to make it available via CDN\n`
  );
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

function extractRegistryDependencies(content: string): string[] {
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

