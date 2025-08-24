import { IDatabaseAdapter, IDatabaseAdapterConstructor } from "./adapter.t";

export interface IDatabaseGenericConnectionConfig<Adapter extends IDatabaseAdapter = IDatabaseAdapter> {
    adapter: IDatabaseAdapterConstructor<Adapter>;
    connectionName: string;
    uri: string,
    options: ReturnType<Adapter['getConfig']>;
}

export interface IDatabaseConfig {
    enableLogging?: boolean;
    onBootConnect?: boolean;
    defaultConnectionName: string;
    keepAliveConnections: string;
}

