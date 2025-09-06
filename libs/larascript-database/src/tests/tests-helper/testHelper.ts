import DatabaseConfig from "@/database/services/DatabaseConfig.js";
import DatabaseService from "@/database/services/DatabaseService.js";
import DB from "@/database/services/DB.js";
import EloquentQueryBuilderService from "@/eloquent/services/EloquentQueryBuilderService.js";
import { IModel, ModelConstructor } from "@/model/index.js";
import { MongoDbAdapter } from "@/mongodb-adapter/adapters/index.js";
import { extractDefaultMongoCredentials } from "@/mongodb-adapter/utils/extractDefaultMongoCredentials.js";
import { PostgresAdapter } from "@/postgres-adapter/adapters/index.js";
import { extractDefaultPostgresCredentials } from "@/postgres-adapter/utils/extractDefaultPostgresCredentials.js";
import { CryptoService } from "@larascript-framework/crypto-js";
import {
  AppSingleton,
  BaseProvider,
  EnvironmentTesting,
  Kernel,
} from "@larascript-framework/larascript-core";
import { LoggerService } from "@larascript-framework/larascript-logger";
import { execSync } from "child_process";
import path from "path";

class TestDatabaseProvider extends BaseProvider {
  async register() {
    const databaseService = new DatabaseService({
      enableLogging: true,
      onBootConnect: true,
      defaultConnectionName: "postgres",
      keepAliveConnections: "mongodb",
      connections: [
        DatabaseConfig.connection(PostgresAdapter, "postgres", {
          uri: extractDefaultPostgresCredentials() as string,
          options: {},
        }),
        DatabaseConfig.connection(MongoDbAdapter, "mongodb", {
          uri: extractDefaultMongoCredentials() as string,
          options: {},
        }),
      ],
    });
    databaseService.register();

    const eloquentQueryBuilder = new EloquentQueryBuilderService();
    const cryptoService = new CryptoService({
      secretKey: "test",
    });
    const dispatcher = (event: any) => {
      console.log('dispatcher', event);
      return Promise.resolve();
    };

    const logger = new LoggerService({
      logPath: path.join(process.cwd(), "storage/logs"),
    });
    await logger.boot();

    DB.init({
      databaseService,
      eloquentQueryBuilder,
      cryptoService,
      dispatcher,
      logger,
    });

    this.bind("dispatcher", dispatcher);
    this.bind("db", databaseService);
  }

  async boot() {
    await AppSingleton.container("db").boot();
  }
}

export const testHelper = {
  testBootApp: async () => {
    await Kernel.boot(
      {
        environment: EnvironmentTesting,
        providers: [new TestDatabaseProvider()],
      },
      {},
    );
  },

  getTestConnectionNames: () => ["mongodb", "postgres"],

  afterAll: async () => {
    await postgresDown();
    await mongodbDown();
  },
};

export const queryBuilder = <Model extends IModel>(
  model: ModelConstructor<Model>,
  connection?: string,
) => {
  return DB.getInstance().queryBuilder(model, connection);
};

function mongodbDown() {
  try {
    // Change directory to project root and run the command
    execSync("pnpm run db:mongodb:down", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error("Failed to start Postgres with pnpm db:mongodb:down");
    throw error;
  }
}

export const postgresDown = () => {
  try {
    // Change directory to project root and run the command
    execSync("pnpm run db:postgres:down", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error("Failed to start Postgres with pnpm db:postgres:up");
    throw error;
  }
};
