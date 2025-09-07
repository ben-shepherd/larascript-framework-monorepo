import AppSetupCommand from "@/core/domains/setup/commands/AppSetupCommand.js";
import { app } from "@/core/services/App.js";
import { BaseProvider } from "@larascript-framework/larascript-core";

class SetupProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering SetupProvider');

        // Register the setup commands
        app('console').registerService().registerAll([
            AppSetupCommand
        ])
    }

}

export default SetupProvider