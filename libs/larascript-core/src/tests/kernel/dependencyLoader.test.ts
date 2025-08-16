import { AppSingleton, CreateDependencyLoader } from "@/app";
import { Environment } from "@/consts";
import { Kernel } from "@/kernel";
import { describe } from "@jest/globals";
import {
  AlternativeDependencyLoaderProvider,
  LoggerProvider,
  MockSuccessfulConnectionDatabaseProvider,
  TestContainers,
} from "./providers/providers";
import LoggerService from "./services/LoggerService";
import MockDatabaseService from "./services/MockDatabaseService";

describe("Dependency Loader Test Suite", () => {
  describe("Kernel with successful database provider", () => {
    beforeAll(async () => {
      // Reset the kernel before each test
      Kernel.getInstance().containers.clear();
      Kernel.getInstance().preparedProviders = [];
      Kernel.getInstance().readyProviders = [];

      await Kernel.boot(
        {
          environment: Environment.testing,
          providers: [
            new LoggerProvider(),
            new MockSuccessfulConnectionDatabaseProvider(),
          ],
        },
        {},
      );
    });

    test("should have logged a connection successful, logger should contain success message", async () => {
      const database = AppSingleton.container<TestContainers, "database">(
        "database",
      );
      const logger = AppSingleton.container<TestContainers, "logger">("logger");

      await database.connect();

      expect(logger.containsLog("Connection OK")).toBeTruthy();
    });
  });

  describe("Kernel with connection failed database provider, logger should contain failed message", () => {
    beforeAll(async () => {
      // Reset the kernel before each test
      Kernel.getInstance().containers.clear();
      Kernel.getInstance().preparedProviders = [];
      Kernel.getInstance().readyProviders = [];

      await Kernel.boot(
        {
          environment: Environment.testing,
          providers: [
            new LoggerProvider(),
            new AlternativeDependencyLoaderProvider(),
          ],
        },
        {},
      );
    });

    test("should have logged a connection failed", async () => {
      const database = AppSingleton.container<TestContainers, "database">(
        "database",
      );
      const logger = AppSingleton.container<TestContainers, "logger">("logger");

      await database.connect();

      expect(logger.containsLog("Connection FAILED")).toBeTruthy();
    });

    test("should create dependency loader", async () => {
      const loader = CreateDependencyLoader.create({
        logger: new LoggerService(),
      });

      const database = new MockDatabaseService();
      database.setDependencyLoader(loader);

      expect(typeof database.logger?.log === "function").toBeTruthy();
    });
  });
});
