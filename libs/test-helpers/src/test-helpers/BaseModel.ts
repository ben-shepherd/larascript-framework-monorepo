export interface BaseModelAttributes {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBaseModel<Attributes extends BaseModelAttributes = BaseModelAttributes> {
    attributes: Attributes;
    setAttributes(attributes: Attributes): void;
    getAttributes(): Attributes;
    getId(): string;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
}

export interface IBaseModelConstructor<T extends IBaseModel> {
    new (attributes?: T['attributes']): T;
}

export class BaseModel<Attributes extends BaseModelAttributes = BaseModelAttributes> implements IBaseModel<Attributes> {
    attributes!: Attributes;

    constructor(
        attributes: Attributes = {} as Attributes,
    ) {
        this.attributes = attributes;
    }

    setAttributes(attributes: Attributes): void {
        this.attributes = attributes;
    }

    getAttributes(): Attributes {
        return this.attributes;
    }

    getId(): string {
        return this.attributes.id;
    }

    getCreatedAt(): Date {
        return this.attributes.createdAt;
    }

    getUpdatedAt(): Date {
        return this.attributes.updatedAt;
    }
}