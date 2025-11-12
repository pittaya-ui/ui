interface IIndexComponent {
    name: string;
    type: string;
    files: string[];
    category: string;
    description?: string;
}

export type { IIndexComponent };