export abstract class AbstractResourceRepository
{
    constructor(protected config: unknown) {
    }

    getConfig<T>(): T {
        return this.config as T;
    }

    setConfig(config: unknown): void {
        this.config = config;
    }
}