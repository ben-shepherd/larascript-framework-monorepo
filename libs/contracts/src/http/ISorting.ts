export type TSortDirection = 'asc' | 'desc'

export type TSortOptions = {
    fieldKey: string;
    directionKey: string;
    defaultField?: string;
    defaultDirection?: TSortDirection;
}