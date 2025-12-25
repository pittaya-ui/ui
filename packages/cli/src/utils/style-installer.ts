import fs from "fs/promises";
import path from "path";
import postcss from "postcss";
import type { AtRule, Declaration, Root, Rule } from "postcss";
import { IConfig } from "../interfaces/IConfig.js";
import { IRegistryComponent } from "../interfaces/IRegistryComponent.js";

export async function applyRegistryStyleToProject(
    styleComponent: IRegistryComponent,
    config: IConfig,
    options?: {
        overwriteCssVars?: boolean;
    }
) {
    const cssPath = config.tailwind?.css;
    if (!cssPath) {
        return;
    }

    const absoluteCssPath = path.resolve(process.cwd(), cssPath);

    const raw = await fs
        .readFile(absoluteCssPath, "utf-8")
        .catch(() => "");

    const next = await transformTailwindV4Css(raw, styleComponent.cssVars ?? {}, {
        overwriteCssVars: options?.overwriteCssVars ?? true,
    });

    await fs.mkdir(path.dirname(absoluteCssPath), { recursive: true });
    await fs.writeFile(absoluteCssPath, next, "utf-8");
}

async function transformTailwindV4Css(
    input: string,
    cssVars: NonNullable<IRegistryComponent["cssVars"]>,
    options: {
        overwriteCssVars: boolean;
    }
) {
    const result = await postcss([
        ensureImportPlugin({ importPath: "tailwindcss" }),
        ensureImportPlugin({ importPath: "tw-animate-css" }),
        ensureCustomVariantDarkPlugin(),
        upsertThemeAtRulePlugin(cssVars.theme ?? {}, {
            overwrite: options.overwriteCssVars,
        }),
        upsertRuleVarsPlugin(":root", cssVars.light ?? {}, {
            overwrite: options.overwriteCssVars,
        }),
        upsertRuleVarsPlugin(".dark", cssVars.dark ?? {}, {
            overwrite: options.overwriteCssVars,
        }),
        ensureBaseLayerPlugin(),
    ]).process(input, { from: undefined });

    return result.css.replace(/(\n\s*\n)+/g, "\n\n").trimStart();
}

function ensureImportPlugin({
    importPath,
}: {
    importPath: string;
}) {
    return {
        postcssPlugin: "pittaya-ensure-import",
        Once(root: Root) {
            const exists = root.nodes.some(
                (n: any) =>
                    n.type === "atrule" &&
                    (n as AtRule).name === "import" &&
                    (n as AtRule).params.includes(`"${importPath}"`)
            );
            if (exists) return;

            const node = postcss.atRule({
                name: "import",
                params: `"${importPath}"`,
            });

            root.prepend(node);
        },
    };
}
ensureImportPlugin.postcss = true;

function ensureCustomVariantDarkPlugin() {
    return {
        postcssPlugin: "pittaya-ensure-custom-variant-dark",
        Once(root: Root) {
            const exists = root.nodes.some(
                (n: any) =>
                    n.type === "atrule" &&
                    (n as AtRule).name === "custom-variant" &&
                    (n as AtRule).params.startsWith("dark ")
            );
            if (exists) return;

            const node = postcss.atRule({
                name: "custom-variant",
                params: "dark (&:is(.dark *))",
            });

            root.append(node);
        },
    };
}
ensureCustomVariantDarkPlugin.postcss = true;

function upsertThemeAtRulePlugin(
    vars: Record<string, string>,
    options: { overwrite: boolean }
) {
    return {
        postcssPlugin: "pittaya-upsert-theme-atrule",
        Once(root: Root) {
            if (Object.keys(vars).length === 0) return;

            let themeNode = root.nodes.find(
                (n: any): n is AtRule =>
                    n.type === "atrule" && (n as AtRule).name === "theme" && (n as AtRule).params === "inline"
            );

            if (!themeNode) {
                themeNode = postcss.atRule({
                    name: "theme",
                    params: "inline",
                });
                root.append(themeNode);
            }

            for (const [k, v] of Object.entries(vars)) {
                const prop = `--${k.replace(/^--/, "")}`;
                const existing = themeNode.nodes?.find(
                    (n: any): n is Declaration => n.type === "decl" && (n as Declaration).prop === prop
                );

                if (existing) {
                    if (options.overwrite) {
                        existing.value = v;
                    }
                } else {
                    themeNode.append(
                        postcss.decl({
                            prop,
                            value: v,
                        })
                    );
                }
            }
        },
    };
}
upsertThemeAtRulePlugin.postcss = true;

function upsertRuleVarsPlugin(
    selector: string,
    vars: Record<string, string>,
    options: { overwrite: boolean }
) {
    return {
        postcssPlugin: `pittaya-upsert-vars-${selector}`,
        Once(root: Root) {
            if (Object.keys(vars).length === 0) return;

            let rule = root.nodes.find(
                (n: any): n is Rule => n.type === "rule" && (n as Rule).selector === selector
            );

            if (!rule) {
                rule = postcss.rule({ selector });
                root.append(rule);
            }

            for (const [k, v] of Object.entries(vars)) {
                const prop = `--${k.replace(/^--/, "")}`;
                const existing = rule.nodes?.find(
                    (n: any): n is Declaration => n.type === "decl" && (n as Declaration).prop === prop
                );

                if (existing) {
                    if (options.overwrite) {
                        existing.value = v;
                    }
                } else {
                    rule.append(
                        postcss.decl({
                            prop,
                            value: v,
                        })
                    );
                }
            }
        },
    };
}
upsertRuleVarsPlugin.postcss = true;

function ensureBaseLayerPlugin() {
    return {
        postcssPlugin: "pittaya-ensure-base-layer",
        Once(root: Root) {
            const hasLayerBase = root.nodes.some(
                (n: any) =>
                    n.type === "atrule" &&
                    (n as AtRule).name === "layer" &&
                    (n as AtRule).params === "base"
            );

            if (hasLayerBase) return;

            const baseLayer = postcss.atRule({
                name: "layer",
                params: "base",
            });

            baseLayer.append(
                postcss.rule({
                    selector: "*",
                    nodes: [
                        postcss.atRule({
                            name: "apply",
                            params: "border-border outline-ring/50",
                        }),
                    ],
                })
            );

            baseLayer.append(
                postcss.rule({
                    selector: "body",
                    nodes: [
                        postcss.atRule({
                            name: "apply",
                            params: "bg-background text-foreground",
                        }),
                    ],
                })
            );

            root.append(baseLayer);
        },
    };
}
ensureBaseLayerPlugin.postcss = true;
