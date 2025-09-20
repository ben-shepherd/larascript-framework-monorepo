import commandsConfig from "@/config/commands.config.js";
import { ConsoleProvider as ConsoleProviderBase } from "@larascript-framework/larascript-console";
import RouteListCommand from "../commands/RouteListCommand.js";
import { app } from "../services/App.js";

export default class ConsoleProvider extends ConsoleProviderBase {

    /**
     * Register method
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     */
    async register(): Promise<void> {
        await super.register();
        
        /**
         * Register internal commands
         */
        app('console').registerService().registerAll([
            RouteListCommand
        ]);
        
        /**
         * Register commands from @/config/app
         */
        app('console').registerService().registerAll(commandsConfig)
    }

}
