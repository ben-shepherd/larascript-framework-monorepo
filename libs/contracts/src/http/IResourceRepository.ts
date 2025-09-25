export type IResourceData = {
    [key: string]: unknown;
} & Record<string, unknown>;

export type IResourceRepositoryConfig = {
    [key: string]: unknown;
} & Record<string, unknown>;

export type IResourceRepositoryConstructor<
T extends IResourceData = IResourceData,
C extends IResourceRepositoryConfig = IResourceRepositoryConfig
> = new (config?: C) => IResourceRepository<T, C>;

export interface IResourceRepository<
    T extends IResourceData = IResourceData,
    C extends IResourceRepositoryConfig = IResourceRepositoryConfig
> {
    setConfig(config: C): void;
    getConfig(): C;
    getResource(id: string): Promise<T | undefined>;
    createResource(data: T): Promise<T>;
    createResourceWithoutSaving(data: T): Promise<T>;
    updateResource(data: T): Promise<T>;
    deleteResource(data: T): Promise<void>;
    getResources(query: object): Promise<T[]>;
    getResourcesCount(query: object): Promise<number>;
    getResourcesPage(query: object, page: number, limit: number): Promise<T[]>;
    getResourceOwnerAttribute(): string;
    stripSensitiveData(data: T): Promise<T>;
}

