import {
  DependencyLoader,
  RequiresDependency,
} from "@/interfaces/Dependency.t.js";
import { TestContainers } from "../providers/providers.js";
import LoggerService from "./LoggerService.js";

type MockDatabaseServiceOptions = {
  connectionWillSucceed: boolean;
};

class AltMockDatabaseService implements RequiresDependency {
  protected logger!: LoggerService;

  constructor(
    protected options: MockDatabaseServiceOptions = {
      connectionWillSucceed: true,
    },
    protected connected: boolean = false,
  ) {}

  setDependencyLoader(loader: DependencyLoader): void {
    this.logger = loader<TestContainers, "logger">("logger");
  }

  async connect(): Promise<boolean> {
    if (false === this.options.connectionWillSucceed) {
      this.logger.log("Connection FAILED");
      this.connected = false;
      return false;
    }

    this.logger.log("Connection OK");
    this.connected = true;
    return true;
  }

  reset() {
    this.connected = false;
    this.options.connectionWillSucceed = true;
  }
}

export default AltMockDatabaseService;
