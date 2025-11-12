import fetch from "node-fetch";
import { IRegistryComponent } from "../interfaces/IRegistryComponent";

const REGISTRY_BASE_URL = "https://raw.githubusercontent.com/pittaya-ui/cli/main/registry";


export async function fetchRegistry(): Promise<any> {
  try {
    const response = await fetch(`${REGISTRY_BASE_URL}/index.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching registry:", error);
    throw new Error("Unable to load the registry of components");
  }
}

export async function getRegistryComponent(name: string): Promise<IRegistryComponent> {
  try {
    const response = await fetch(
      `${REGISTRY_BASE_URL}/components/${name}.json`
    );

    if (!response.ok) {
      throw new Error(`Component "${name}" not found in registry`);
    }

    return await response.json() as IRegistryComponent;
  } catch (error: any) {
    throw new Error(`Error loading component "${name}": ${error.message}`);
  }
}

export function setRegistryUrl(url: string) {
  process.env.PITTAYA_REGISTRY_URL = url;
}

