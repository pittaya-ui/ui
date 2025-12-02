import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { IRegistryComponent } from "../packages/cli/src/interfaces/IRegistryComponent";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_COMPONENTS_DIR = path.join(__dirname, "../registry/components");

interface ValidationResult {
  component: string;
  missing: string[];
  declared: string[];
  detected: string[];
}

/**
 * Extracts NPM dependencies from component code
 * Excludes: react, react-dom, next (they are peer dependencies)
 */
function extractNpmDependencies(content: string): string[] {
  const deps = new Set<string>();

  // Match: from "package-name" or from 'package-name'
  // Excludes: @/* paths, ./* relative paths, ../* relative paths
  const importRegex = /from\s+["']([^@.\/][^"']+)["']/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    let pkg = match[1];

    // Handle scoped packages (@radix-ui/react-slot -> @radix-ui/react-slot)
    // Handle sub-paths (react-syntax-highlighter/dist/... -> react-syntax-highlighter)
    if (pkg.startsWith("@")) {
      // Scoped package: keep full path for first two parts
      const parts = pkg.split("/");
      pkg = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : pkg;
    } else {
      // Regular package: take only the first part
      pkg = pkg.split("/")[0];
    }

    if (pkg && pkg !== "react" && pkg !== "react-dom" && pkg !== "next") {
      deps.add(pkg);
    }
  }

  return Array.from(deps).sort();
}

/**
 * Validates if all NPM dependencies used in code are declared
 */
async function validateComponent(componentPath: string): Promise<ValidationResult> {
  const componentName = path.basename(componentPath, ".json");
  const content = await fs.readFile(componentPath, "utf-8");
  const component: IRegistryComponent = JSON.parse(content);

  const codeContent = component.files[0].content;
  const detectedDeps = extractNpmDependencies(codeContent);

  const declaredDeps = component.dependencies || [];

  const missing = detectedDeps.filter(dep => !declaredDeps.includes(dep));

  return {
    component: componentName,
    missing,
    declared: declaredDeps,
    detected: detectedDeps,
  };
}

async function validateAll() {
  console.log("🔍 Validating dependencies in registry components...\n");

  const files = await fs.readdir(REGISTRY_COMPONENTS_DIR);
  const jsonFiles = files.filter(f => f.endsWith(".json"));

  const results: ValidationResult[] = [];
  let hasErrors = false;

  for (const file of jsonFiles) {
    const filePath = path.join(REGISTRY_COMPONENTS_DIR, file);
    const result = await validateComponent(filePath);
    results.push(result);

    if (result.missing.length > 0) {
      hasErrors = true;
      console.log(`❌ ${result.component}`);
      console.log(`   Declared: [${result.declared.join(", ") || "none"}]`);
      console.log(`   Detected: [${result.detected.join(", ")}]`);
      console.log(`   Missing:  [${result.missing.join(", ")}]`);
      console.log("");
    } else if (result.detected.length > 0) {
      console.log(`✅ ${result.component} - ${result.detected.length} dependencies OK`);
    } else {
      console.log(`✅ ${result.component} - no external dependencies`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total components: ${results.length}`);
  console.log(`   With errors: ${results.filter(r => r.missing.length > 0).length}`);
  console.log(`   Valid: ${results.filter(r => r.missing.length === 0).length}`);

  if (hasErrors) {
    console.log("\n⚠️  Some components have missing dependencies!");
    console.log("💡 To fix: Add missing dependencies to the component JSON files\n");
    process.exit(1);
  } else {
    console.log("\n✨ All components have correct dependencies!\n");
  }
}

validateAll().catch((error) => {
  console.error("\n❌ Error validating dependencies:", error);
  process.exit(1);
});

