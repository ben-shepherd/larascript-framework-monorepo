import { IBaseModel, IBaseModelConstructor } from "@/test-helpers/BaseModel";

export interface IBaseInMemoryRepository<T extends IBaseModel> {
    update(where: string, value: unknown, data: Partial<T['attributes']>): void;
    delete(where: string, value: unknown): void;
    setRecords(data: T[]): void;
    getRecords(): T[];
    clearRecords(): void;
}

export abstract class BaseInMemoryRepository<T extends IBaseModel> implements IBaseInMemoryRepository<T> {
    protected records: T[] = [];

    constructor(
        protected model: IBaseModelConstructor<T>,
    ) {}

    create(attributes: T['attributes']): T {
        const item = new this.model(attributes);
        this.records.push(item);
        return item;
    }

    update(where: string, value: unknown, data: Partial<T['attributes']>): void {
        this.records = this.records.map(item => {
            if (item.getAttributes()[where] === value) {
                item.setAttributes({ ...item.getAttributes(), ...data });
            }
            return item;
        });
    }

    delete(where: string, value: unknown): void {
        this.records = this.records.filter(item => item.getAttributes()[where] !== value);
    }

    setRecords(data: T[]): void {
        this.records = data;
    }

    getRecords(): T[] {
        return this.records;
    }

    clearRecords(): void {
        this.records = [];
    }
}