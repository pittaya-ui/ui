import fs from "fs/promises";
import path from "path";
import { IConfig } from "../interfaces/IConfig.js";
import { IPittayaProjectConfig } from "../interfaces/IPittayaProjectConfig.js";

export type LoadedProjectConfig = {
    config: IConfig;
    pittaya: IPittayaProjectConfig;
};

export function applyPittayaProjectConfig(pittaya: IPittayaProjectConfig) {
    if (pittaya.registry?.url) {
        process.env.PITTAYA_REGISTRY_URL = pittaya.registry.url;
    }

    if (typeof pittaya.registry?.preferLocal === "boolean") {
        process.env.PITTAYA_REGISTRY_PREFER_LOCAL = String(pittaya.registry.preferLocal);
    }
}

async function readJsonIfExists<T>(absolutePath: string): Promise<T | null> {
    try {
        const raw = await fs.readFile(absolutePath, "utf-8");
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export async function loadProjectConfig(cwd: string = process.cwd()): Promise<LoadedProjectConfig> {
    const componentsJsonPath = path.join(cwd, "components.json");
    const pittayaJsonPath = path.join(cwd, "pittaya.json");

    const config = await readJsonIfExists<IConfig>(componentsJsonPath);
    if (!config) {
        throw new Error("components.json not found");
    }

    const pittaya = (await readJsonIfExists<IPittayaProjectConfig>(pittayaJsonPath)) ?? {};

    return { config, pittaya };
}
