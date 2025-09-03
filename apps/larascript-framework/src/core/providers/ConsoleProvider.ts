import { ConsoleProvider as ConsoleProviderBase } from "@larascript-framework/larascript-console";
import commandsConfig from "@src/config/commands.config";
import RouteListCommand from "../commands/RouteListCommand";
import { app } from "../services/App";

export default class ConsoleProvider extends ConsoleProviderBase {

    /**
     * Register method
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     */
    async register(): Promise<void> {
        super.register();

        /**
         * Register internal commands
         */
        app('console').registerService().registerAll([
            RouteListCommand
        ]);
        
        /**
         * Register commands from @src/config/app
         */
        app('console').registerService().registerAll(commandsConfig)
    }

}
