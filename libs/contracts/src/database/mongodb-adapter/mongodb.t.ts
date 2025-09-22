import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { Db, MongoClient } from "mongodb";
import { IDatabaseSchema } from "../database/schema.t.js";
import { IRelationshipResolver } from "../eloquent/relationships.t.js";
import { IModel } from "../model/model.t.js";

import { IEloquent } from "../eloquent/eloquent.t.js";
import { IMongoConfig } from "./IMongoConfig.js";

export interface IMongoDbAdapter {
  _adapter_type_: string;

  getConfig(): IMongoConfig;

  normalizeColumn(col: string): string;

  getDockerComposeFileName(): string;

  getDefaultCredentials(): string | null;

  getRelationshipResolver(): IRelationshipResolver;

  getClient(): MongoClient;

  getDb(): Db;

  connectDefault(): Promise<void>;

  getMongoClientWithDatabase(
    database?: string,
    options?: object,
  ): Promise<MongoClient>;

  getSchema(): IDatabaseSchema;

  isConnected(): Promise<boolean>;

  getEloquentConstructor<Model extends IModel>(): TClassConstructor<
    IEloquent<Model>
  >;

  createMigrationSchema(tableName: string): Promise<unknown>;

  close(): Promise<void>;
}
