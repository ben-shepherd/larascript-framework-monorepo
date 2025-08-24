import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IDatabaseAdapter } from "./adapter.t";

export interface IConnectionTypes extends Record<string, IDatabaseAdapter> {}

export interface IDatabaseService
{   
    // boot(): Promise<void>;
    
    // registerConnections(): void

    // showLogs(): boolean
    
    // getDefaultConnectionName(): string;

    // setDefaultConnectionName(connectionName: string): void;

    // getAdapter<Adapter extends IDatabaseAdapter = IDatabaseAdapter>(connectionName?: string): Adapter;

    // getAdapterConstructor<Adapter extends IDatabaseAdapter = IDatabaseAdapter>(connectionName?: string): IDatabaseAdapterConstructor<Adapter>

    getAllAdapterConstructors(): TClassConstructor<IDatabaseAdapter>[]

    // isRegisteredAdapter(adapter: TClassConstructor<IDatabaseAdapter>, connectionName?: string): boolean

    // getDefaultCredentials(adapterName: string): string | null;

    // schema<TSchema extends IDatabaseSchema = IDatabaseSchema>(connectionName?: string): TSchema;

    // createMigrationSchema(tableName: string, connectionName?: string): Promise<unknown>;
}