interface IRegistryComponent {
    name: string;
    type: string;
    description?: string;
    dependencies?: string[];
    registryDependencies?: string[];
    files: Array<{
      name: string;
      content: string;
    }>;
}

export type { IRegistryComponent };