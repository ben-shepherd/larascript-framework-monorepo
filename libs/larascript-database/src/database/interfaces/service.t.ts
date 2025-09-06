import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IMongoDbAdapter } from "../../mongodb-adapter/interfaces/mongodb.t.js";
import { IPostgresAdapter } from "../../postgres-adapter/interfaces/postgres.t.js";
import { IDatabaseAdapter } from "./adapter.t.js";
import { IDatabaseSchema } from "./schema.t.js";

export interface IConnectionTypes extends Record<string, IDatabaseAdapter> {}

export interface IDatabaseService {

  boot(): Promise<void>;

  register(): void;

  showLogs(): boolean;

  getDefaultConnectionName(): string;

  // setDefaultConnectionName(connectionName: string): void;

  getAdapter<Adapter extends IDatabaseAdapter = IDatabaseAdapter>(
    connectionName?: string,
  ): Adapter;

  // getAdapterConstructor<Adapter extends IDatabaseAdapter = IDatabaseAdapter>(connectionName?: string): IDatabaseAdapterConstructor<Adapter>

  getAllAdapterConstructors(): TClassConstructor<IDatabaseAdapter>[];

  isRegisteredAdapter(adapter: TClassConstructor<IDatabaseAdapter>, connectionName?: string): boolean

  getDefaultCredentials(adapterName: string): string | null;

  schema<TSchema extends IDatabaseSchema = IDatabaseSchema>(
    connectionName?: string,
  ): TSchema;

  createMigrationSchema(tableName: string, connectionName?: string): Promise<unknown>;

  postgres(connectionName?: string): IPostgresAdapter;

  mongodb(connectionName?: string): IMongoDbAdapter;
}
