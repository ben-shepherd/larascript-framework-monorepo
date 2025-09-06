import { MongoDbAdapter } from "../../mongodb-adapter/index.js";
import { PostgresAdapter } from "../../postgres-adapter/index.js";
import {
  IDatabaseAdapter,
  IDatabaseAdapterConstructor,
} from "../interfaces/adapter.t.js";
import { IDatabaseGenericConnectionConfig } from "../interfaces/config.t.js";

export class DatabaseConfig {

  /**
   * Create a database connection configuration for a MongoDB database.
   * @param connectionName - The name of the connection.
   * @param options - The options for the connection.
   * @returns The database connection configuration.
   */
  public static mongodb(
    connectionName: string,
    options: ReturnType<MongoDbAdapter["getConfig"]>,
  ): IDatabaseGenericConnectionConfig {
    return {
      connectionName,
      adapter: MongoDbAdapter,
      options,
    }
  }

  /**
   * Create a database connection configuration for a PostgreSQL database.
   * @param connectionName - The name of the connection.
   * @param options - The options for the connection.
   * @returns The database connection configuration.
   */
  public static postgres(
    connectionName: string,
    options: ReturnType<PostgresAdapter["getConfig"]>,
  ): IDatabaseGenericConnectionConfig {
    return {
      connectionName,
      adapter: PostgresAdapter,
      options,
    }
  }

  /**
   * DatabaseConfig provides static helpers for constructing database connection configurations.
   *
   * @class DatabaseConfig
   * @example
   * const config = DatabaseConfig.connection("default", MyAdapter, { ...options });
   */
  public static connection<Adapter extends IDatabaseAdapter = IDatabaseAdapter>(
    adapter: IDatabaseAdapterConstructor<Adapter>,
    connectionName: string,
    options: ReturnType<Adapter["getConfig"]>,
  ): IDatabaseGenericConnectionConfig {
    return {
      connectionName,
      adapter,
      options,
    };
  }
}

export default DatabaseConfig;
