interface IRegistryComponent {
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
    target?: string;
    type?: string;
  }>;
}

export type { IRegistryComponent };