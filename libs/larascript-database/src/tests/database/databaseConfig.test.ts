import DatabaseConfig from "@/database/services/DatabaseConfig";
import { describe, expect, test } from "@jest/globals";
import { MockSQLAdapter } from "./mocks/MockSQLAdapter";

describe("Database Config", () => {

  describe("Database Config", () => {
    test("should perform expected behavior", () => {
      const expected = {
        connectionName: 'test',
        adapter: MockSQLAdapter,
        options: {
            connectionString: 'sql://user:pass@localhost:3306/db'
        }
      }

      expect(DatabaseConfig.connection("test", MockSQLAdapter, { connectionString: 'sql://user:pass@localhost:3306/db' })).toEqual(expected)
    })
  });
});
