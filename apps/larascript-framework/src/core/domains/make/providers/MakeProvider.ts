import MakeCmdCommand from "@/core/domains/make/commands/MakeCmdCommand.js";
import MakeController from "@/core/domains/make/commands/MakeControllerCommand.js";
import MakeEventCommand from "@/core/domains/make/commands/MakeEventCommand.js";
import MakeFactoryCommand from "@/core/domains/make/commands/MakeFactoryCommand.js";
import MakeListenerCommand from "@/core/domains/make/commands/MakeListenerCommand.js";
import MakeMiddlewareCommand from "@/core/domains/make/commands/MakeMiddlewareCommand.js";
import MakeMigrationCommand from "@/core/domains/make/commands/MakeMigrationCommand.js";
import MakeModelCommand from "@/core/domains/make/commands/MakeModelCommand.js";
import MakeObserverCommand from "@/core/domains/make/commands/MakeObserverCommand.js";
import MakeProviderCommand from "@/core/domains/make/commands/MakeProviderCommand.js";
import MakeRepositoryCommand from "@/core/domains/make/commands/MakeRepositoryCommand.js";
import MakeRouteResourceCommand from "@/core/domains/make/commands/MakeRouteResourceCommand.js";
import MakeRoutesCommand from "@/core/domains/make/commands/MakeRoutesCommand.js";
import MakeSeederCommand from "@/core/domains/make/commands/MakeSeederCommand.js";
import MakeServiceCommand from "@/core/domains/make/commands/MakeServiceCommand.js";
import MakeSingletonCommand from "@/core/domains/make/commands/MakeSingletonCommand.js";
import MakeSubscriberCommand from "@/core/domains/make/commands/MakeSubscriberCommand.js";
import MakeValidatorCommand from "@/core/domains/make/commands/MakeValidatorCommand.js";
import { app } from "@/core/services/App.js";
import { BaseProvider } from "@larascript-framework/larascript-core";

export default class MakeProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering MakeProvider')    

        // Register the make commands
        app('console').registerService().registerAll([
            MakeCmdCommand,
            MakeListenerCommand,
            MakeEventCommand,
            MakeModelCommand,
            MakeObserverCommand,
            MakeRepositoryCommand,
            MakeServiceCommand,
            MakeSingletonCommand,
            MakeSubscriberCommand,
            MakeProviderCommand,
            MakeRoutesCommand,
            MakeRouteResourceCommand,
            MakeMiddlewareCommand,
            MakeController,
            MakeValidatorCommand,
            MakeMigrationCommand,
            MakeSeederCommand,
            MakeFactoryCommand
        ])
    }

}
