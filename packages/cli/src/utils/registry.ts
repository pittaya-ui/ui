import fetch from "node-fetch";
import { IRegistryComponent } from "../interfaces/IRegistryComponent.js";
import { IConfig } from "../interfaces/IConfig.js";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DEFAULT_REGISTRY_BASE_URL =
  "https://raw.githubusercontent.com/pittaya-ui/cli/main/registry";

function shouldPreferLocalRegistry(): boolean {
  const raw = process.env.PITTAYA_REGISTRY_PREFER_LOCAL;
  if (raw == null) return false;
  const normalized = raw.toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function getLocalRegistryBaseUrl(): string | null {
  try {
    const filePath = fileURLToPath(import.meta.url);
    const dirPath = path.dirname(filePath);
    const candidate = path.resolve(dirPath, "../../../registry");
    if (!existsSync(candidate)) return null;
    if (!existsSync(path.join(candidate, "styles"))) return null;
    return candidate;
  } catch {
    return null;
  }
}

function getRegistryBaseUrl() {
  const localRegistry = shouldPreferLocalRegistry() ? getLocalRegistryBaseUrl() : null;
  if (localRegistry) return localRegistry;

  if (process.env.PITTAYA_REGISTRY_URL) {
    return process.env.PITTAYA_REGISTRY_URL;
  }

  return DEFAULT_REGISTRY_BASE_URL;
}

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

async function readJsonFromRegistry(relativePath: string, config?: IConfig) {
  const baseUrl = getRegistryBaseUrl();

  if (isHttpUrl(baseUrl)) {
    const response = await fetch(`${baseUrl}/${relativePath}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }

  const absolutePath = path.resolve(baseUrl, relativePath);
  const raw = await fs.readFile(absolutePath, "utf-8");
  return JSON.parse(raw);
}

function getStyleFromConfig(config?: IConfig): string {
  return config?.style || "new-york";
}

export async function fetchRegistry(config?: IConfig): Promise<any> {
  try {
    const style = getStyleFromConfig(config);

    const styleIndex = await readJsonFromRegistry(`styles/${style}/index.json`, config);
    return styleIndex;
  } catch (error) {
    console.error("Error fetching registry:", error);
    throw new Error("Unable to load the registry of components");
  }
}

export async function getRegistryComponent(
  name: string,
  config?: IConfig
): Promise<IRegistryComponent> {
  try {
    const style = getStyleFromConfig(config);

    const styleComponent = await readJsonFromRegistry(
      `styles/${style}/components/${name}.json`,
      config
    );
    return styleComponent as IRegistryComponent;
  } catch (error: any) {
    throw new Error(`Error loading component "${name}": ${error.message}`);
  }
}

export function setRegistryUrl(url: string) {
  process.env.PITTAYA_REGISTRY_URL = url;
}
