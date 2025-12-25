interface IPittayaProjectConfig {
    registry?: {
        url?: string;
        preferLocal?: boolean;
    };

    theme?: {
        overwriteCssVars?: boolean;
    };

    install?: {
        autoInstallDeps?: boolean;
    };
}

export type { IPittayaProjectConfig };
