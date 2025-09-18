import AppSetupCommand from "@/core/domains/setup/commands/AppSetupCommand.js";
import { app } from "@/core/services/App.js";
import { BaseProvider } from "@larascript-framework/larascript-core";
import { SetupService } from "./SetupService.js";

class SetupProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering SetupProvider');

        /**
         * Initialize the setup service with the env service
         * - This will be available within the setup commands
         */
        SetupService.init({
            envService: app('envService')
        });

        // Register the setup commands
        app('console').registerService().registerAll([
            AppSetupCommand
        ])
    }

}

export default SetupProvider