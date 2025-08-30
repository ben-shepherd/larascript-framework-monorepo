import DatabaseConfig from "@/database/services/DatabaseConfig";
import { MongoDbAdapter } from "@/mongodb-adapter/adapters";
import { PostgresAdapter } from "@/postgres-adapter/adapters/PostgresAdapter";
import { describe, expect, test } from "@jest/globals";
import { MockSQLAdapter } from "./mocks/MockSQLAdapter";

describe("Database Config", () => {
  describe("Database Config", () => {
    test("should perform expected behavior", () => {
      const expected = {
        connectionName: "test",
        adapter: MockSQLAdapter,
        options: {
          connectionString: "sql://user:pass@localhost:3306/db",
        },
      };

      expect(
        DatabaseConfig.connection(MockSQLAdapter, "test", {
          connectionString: "sql://user:pass@localhost:3306/db",
        }),
      ).toEqual(expected);
    });
  });

  describe("DatabaseConfig.postgres", () => {
    test("should perform expected behavior", () => {
      const expected = {
        connectionName: "test",
        adapter: PostgresAdapter,
        options: {
          uri: "postgres://user:pass@localhost:5432/db",
          options: {},
        },
      };

      expect(
        DatabaseConfig.postgres("test", {
          uri: "postgres://user:pass@localhost:5432/db",
          options: {}
        }),
      ).toEqual(expected);
    });
    
  });

  describe("DatabaseConfig.mongodb", () => {
    test("should perform expected behavior", () => {
      const expected = {
        connectionName: "test",
        adapter: MongoDbAdapter,
        options: {
          uri: "mongodb://user:pass@localhost:27017/db",
          options: {},
        },
      };

      expect(
        DatabaseConfig.mongodb("test", {
          uri: "mongodb://user:pass@localhost:27017/db",
          options: {},
        }),
      ).toEqual(expected);
    });
  });
});
