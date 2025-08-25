


import { IDatabaseAdapter, IDatabaseAdapterConstructor } from "../interfaces/adapter.t";
import { IDatabaseGenericConnectionConfig } from "../interfaces/config.t";

class DatabaseConfig {

    /**
     * DatabaseConfig provides static helpers for constructing database connection configurations.
     * 
     * @class DatabaseConfig
     * @example
     * const config = DatabaseConfig.connection("default", MyAdapter, { ...options });
     */
    public static connection<Adapter extends IDatabaseAdapter = IDatabaseAdapter>(
        connectionName: string,
        adapter: IDatabaseAdapterConstructor<Adapter>,
        options: ReturnType<Adapter['getConfig']>
    ): IDatabaseGenericConnectionConfig {
        return {
            connectionName,
            adapter,
            options
        }
    }
    
}

export default DatabaseConfig