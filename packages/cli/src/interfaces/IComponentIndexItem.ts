interface IComponentIndexItem {
    slug: string;
    description?: string;
    category: string;
    dependencies?: string[];
    internalDependencies?: string[];
}

export type { IComponentIndexItem };