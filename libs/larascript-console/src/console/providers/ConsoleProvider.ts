import { BaseProvider } from "@larascript-framework/larascript-core";
import readline from "readline";
import HelpCommand from "../commands/HelpCommand";
import ConsoleService from "../service/ConsoleService";

export class ConsoleProvider extends BaseProvider {
  /**
   * Register method
   * Called when the provider is being registered
   * Use this method to set up any initial configurations or services
   */
  async register(): Promise<void> {
    /**
     * Add readline to the container
     * Prevents issue:
     *  MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 end listeners added to [Socket]
     */
    this.bind(
      "readline",
      readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      }),
    );

    const consoleService = new ConsoleService();
    consoleService.registerService().registerAll([HelpCommand]);

    /**
     * Add the console service to the container
     */
    this.bind("console", consoleService);
  }
}
