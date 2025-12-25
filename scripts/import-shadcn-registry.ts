import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

type ShadRegistryItem = {
    $schema?: string;
    name: string;
    type: string;
    author?: string;
    description?: string;
    dependencies?: string[];
    devDependencies?: string[];
    registryDependencies?: string[];
    files?: Array<{
        path: string;
        content?: string;
        type?: string;
        target?: string;
    }>;
    cssVars?: {
        theme?: Record<string, string>;
        light?: Record<string, string>;
        dark?: Record<string, string>;
    };
};

type PittayaRegistryComponent = {
    $schema?: string;
    name: string;
    type: string;
    author?: string;
    description?: string;
    dependencies?: string[];
    devDependencies?: string[];
    registryDependencies?: string[];
    cssVars?: {
        theme?: Record<string, string>;
        light?: Record<string, string>;
        dark?: Record<string, string>;
    };
    files: Array<{
        name: string;
        content: string;
        type?: string;
        target?: string;
    }>;
};

type PittayaStyleIndex = {
    $schema: string;
    version: string;
    components: Array<{
        name: string;
        type: string;
        files: string[];
        category: string;
        description?: string;
    }>;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SHAD_ROOT = path.join(__dirname, "../../shad_ui");
const SHAD_STYLES_DIR = path.join(SHAD_ROOT, "apps/v4/public/r/styles");
const SHAD_GLOBALS_CSS = path.join(SHAD_ROOT, "apps/v4/styles/globals.css");

const REGISTRY_DIR = path.join(__dirname, "../registry");

const DEFAULT_STYLES = ["new-york", "default"] as const;

type ImportMode = "core" | "all";

function getImportMode(): ImportMode {
    const mode = (process.env.SHAD_IMPORT_MODE || "core").toLowerCase();
    return mode === "all" ? "all" : "core";
}

function getCoreAllowlist() {
    return new Set([
        "style",
        "utils",
        "button",
        "card",
        "tabs",
        "input",
        "badge",
        "separator",
        "skeleton",
        "sonner",
    ]);
}

async function main() {
    console.log("🔁 Importando registry do Shadcn (v4) para o Pittaya...\n");

    const mode = getImportMode();
    console.log(`Modo: ${mode}`);
    console.log(`Fonte: ${SHAD_STYLES_DIR.replaceAll("\\", "/")}`);
    console.log(`Destino: ${REGISTRY_DIR.replaceAll("\\", "/")}`);

    const globalsCss = await fs.readFile(SHAD_GLOBALS_CSS, "utf-8");
    const cssVarsFromGlobals = extractCssVarsFromGlobalsCss(globalsCss);

    for (const style of DEFAULT_STYLES) {
        await importStyle(style, cssVarsFromGlobals, mode);
    }

    console.log("\n✅ Registry gerado com sucesso.");
    console.log("💡 Próximo passo: commitar e publicar o registry (para a URL do GitHub Raw).\n");
}

async function importStyle(
    style: string,
    styleCssVars: { theme: Record<string, string>; light: Record<string, string>; dark: Record<string, string> },
    mode: ImportMode
) {
    console.log(`\n📦 Gerando style: ${style}`);

    const styleSrcDir = path.join(SHAD_STYLES_DIR, style);
    const styleDstDir = path.join(REGISTRY_DIR, "styles", style);
    const componentsDstDir = path.join(styleDstDir, "components");

    await fs.mkdir(componentsDstDir, { recursive: true });

    const allowlist = getCoreAllowlist();

    const entries = await fs.readdir(styleSrcDir);
    const jsonFiles = entries.filter((f) => f.endsWith(".json"));

    const index: PittayaStyleIndex = {
        $schema: "../../schema.json",
        version: "0.0.1",
        components: [],
    };

    // 1) Criar/atualizar item "style" (registry:style) usando cssVars extraídas do globals.css
    const styleItem: PittayaRegistryComponent = {
        $schema: "https://raw.githubusercontent.com/pittaya-ui/cli/main/registry/schema.json",
        name: "style",
        type: "registry:style",
        author: "shadcn (https://ui.shadcn.com)",
        description: `Base style (${style}) - importado do Shadcn`,
        dependencies: [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "tw-animate-css",
        ],
        registryDependencies: ["utils"],
        cssVars: {
            theme: styleCssVars.theme,
            light: styleCssVars.light,
            dark: styleCssVars.dark,
        },
        files: [],
    };

    await writeComponentJson(path.join(componentsDstDir, "style.json"), styleItem);
    index.components.push({
        name: "style",
        type: "registry:style",
        files: ["style"],
        category: "Style",
        description: styleItem.description,
    });

    // 2) Importar itens do Shadcn para esse style
    for (const file of jsonFiles) {
        const name = file.replace(/\.json$/, "");

        // Itens agregados / que não queremos importar diretamente.
        if (name === "registry") {
            continue;
        }

        // O item de estilo é gerado por nós (com cssVars). Não sobrescrever.
        if (name === "style") {
            continue;
        }

        if (mode === "core" && !allowlist.has(name)) {
            continue;
        }

        const raw = await fs.readFile(path.join(styleSrcDir, file), "utf-8");
        const item = JSON.parse(raw) as ShadRegistryItem;

        // Ignorar imagens e registries agregados
        if (!item || typeof item !== "object" || !item.name) {
            continue;
        }

        // No Shad, existem itens tipo registry:theme (ex.: theme-daylight). Por enquanto,
        // a CLI do Pittaya só aplica o item "style" no init. Vou importar themes também
        // porque eles podem ser úteis no futuro.

        const out: PittayaRegistryComponent = {
            $schema: "https://raw.githubusercontent.com/pittaya-ui/cli/main/registry/schema.json",
            name: item.name,
            type: item.type,
            author: item.author,
            description: item.description,
            dependencies: item.dependencies,
            devDependencies: item.devDependencies,
            registryDependencies: item.registryDependencies,
            cssVars: item.cssVars,
            files: (item.files ?? [])
                .filter((f) => typeof f.content === "string" && f.content.length > 0)
                .map((f) => ({
                    name: normalizeFileName(f.path),
                    content: f.content as string,
                    type: f.type,
                    target: f.target,
                })),
        };

        // Se for um item sem files (ex.: style/index no shad), ainda assim mantemos para consistência.
        if (!out.files) {
            out.files = [];
        }

        await writeComponentJson(path.join(componentsDstDir, `${name}.json`), out);

        if (!index.components.some((c) => c.name === out.name)) {
            index.components.push({
                name: out.name,
                type: out.type,
                files: [out.name],
                category: categoryFromType(out.type),
                description: out.description,
            });
        }
    }

    await fs.writeFile(
        path.join(styleDstDir, "index.json"),
        JSON.stringify(index, null, 2),
        "utf-8"
    );

    console.log(`${index.components.length} itens no index (${style})`);
}

function normalizeFileName(p: string) {
    return p.replace(/^registry\/(new-york|default)(-v4)?\//, "");
}

function categoryFromType(type: string) {
    if (type === "registry:ui") return "UI";
    if (type === "registry:lib") return "Library";
    if (type === "registry:hook") return "Hooks";
    if (type === "registry:theme") return "Theme";
    if (type === "registry:style") return "Style";
    return "Other";
}

async function writeComponentJson(filePath: string, component: PittayaRegistryComponent) {
    await fs.writeFile(filePath, JSON.stringify(component, null, 2), "utf-8");
}

function extractCssVarsFromGlobalsCss(source: string) {
    const themeBlock = extractBlock(source, /@theme\s+inline\s*\{/, "}");
    const rootBlock = extractBlock(source, /:root\s*\{/, "}");
    const darkBlock = extractBlock(source, /\.dark\s*\{/, "}");

    return {
        theme: extractDecls(themeBlock),
        light: extractDecls(rootBlock),
        dark: extractDecls(darkBlock),
    };
}

function extractBlock(source: string, startRegex: RegExp, endToken: string) {
    const start = source.search(startRegex);
    if (start < 0) return "";

    const fromStart = source.slice(start);
    const openBrace = fromStart.indexOf("{");
    if (openBrace < 0) return "";

    const afterOpen = fromStart.slice(openBrace + 1);

    let depth = 1;
    let i = 0;
    for (; i < afterOpen.length; i++) {
        const ch = afterOpen[i];
        if (ch === "{") depth++;
        if (ch === "}") depth--;
        if (depth === 0) break;
    }

    if (i >= afterOpen.length) return "";
    return afterOpen.slice(0, i);
}

function extractDecls(block: string) {
    const result: Record<string, string> = {};
    const lines = block.split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("--")) continue;

        const match = trimmed.match(/^(--[a-zA-Z0-9\-]+)\s*:\s*(.+?);?$/);
        if (!match) continue;

        const prop = match[1];
        const value = match[2].trim();

        // Convert para o formato esperado pelo cssVars json: sem os dois hífens.
        result[prop.replace(/^--/, "")] = value;
    }

    return result;
}

main().catch((err) => {
    console.error("\n❌ Erro ao importar registry do Shadcn:", err);
    process.exit(1);
});
