import { BaseProvider } from "@larascript-framework/larascript-core";
import HelpCommand from "../commands/HelpCommand.js";
import ConsoleService from "../service/ConsoleService.js";

export class ConsoleProvider extends BaseProvider {
  /**
   * Register method
   * Called when the provider is being registered
   * Use this method to set up any initial configurations or services
   */
  async register(): Promise<void> {
    const consoleService = new ConsoleService();
    consoleService.registerService().registerAll([HelpCommand]);

    /**
     * Add the console service to the container
     */
    this.bind("console", consoleService);
  }
}
