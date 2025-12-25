interface IConfig {
  $schema?: string;

  style?: string;
  rsc?: boolean;
  tsx?: boolean;

  tailwind?: {
    config?: string;
    css: string;
    baseColor?: string;
    cssVariables?: boolean;
    prefix?: string;
  };

  aliases: {
    components: string;
    utils: string;
    ui: string;
    lib: string;
    hooks: string;
  };

  iconLibrary?: string;
}

export type { IConfig };