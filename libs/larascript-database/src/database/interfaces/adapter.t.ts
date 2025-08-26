import { IEloquent } from "@/eloquent/interfaces/eloquent.t";
import { IRelationshipResolver } from "@/eloquent/interfaces/relationships.t";
import { IModel } from "@/model/interfaces/model.t";
import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IPrepareOptions } from "./options.t";
import { IDatabaseSchema } from "./schema.t";

export interface IAdapterComposerFileName {
    fullName: string,
    shortName: string
}

export interface IDatabaseAdapterConstructor<T extends IDatabaseAdapter = IDatabaseAdapter> extends TClassConstructor<T> {
    new (...args: any[]): T;
}

export interface IDatabaseAdapters {
    [key: string]: IDatabaseAdapter
}

export interface IDatabaseAdapter {

    _adapter_type_: string;

    getConfig(): object;

    normalizeColumn(col: string): string

    setConnectionName(...args: any[]): void;

    getConnectionName(...args: any[]): string;

    connectDefault(): Promise<unknown>;

    isConnected(): Promise<boolean>;

    getSchema(): IDatabaseSchema;

    getEloquentConstructor<Model extends IModel = IModel>(): TClassConstructor<IEloquent<Model>>;

    getRelationshipResolver(connection?: string): IRelationshipResolver;

    getDockerComposeFileName(): string;

    getDefaultCredentials(): string | null;

    createMigrationSchema(...args: any[]): Promise<unknown>;

    prepareDocument<T extends object = object>(document: T, prepareOptions?: IPrepareOptions): T;

    close(): Promise<void>;
}