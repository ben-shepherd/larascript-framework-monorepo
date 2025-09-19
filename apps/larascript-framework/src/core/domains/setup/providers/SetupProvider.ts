import AppSetupCommand from "@/core/domains/setup/commands/AppSetupCommand.js";
import { app } from "@/core/services/App.js";
import { BaseProvider } from "@larascript-framework/larascript-core";
import { SetupService } from "./SetupService.js";

class SetupProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering SetupProvider');

        /**
         * Initialize the setup service with the env service and package json service
         * - These services are required for the setup commands
         * - The package json service is required for the setup commands to update the package.json file
         * - The env service is required for setting values in the .env file
         */
        SetupService.init({
            envService: app('envService'),
            packageJsonService: app('packageJsonService'),
            cryptoService: app('crypto')
        });

        // Register the setup commands
        app('console').registerService().registerAll([
            AppSetupCommand
        ])
    }

}

export default SetupProvider