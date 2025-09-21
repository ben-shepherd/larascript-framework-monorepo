import { app } from "@/core/services/App.js";
import { BaseProvider } from "@larascript-framework/larascript-core";
import { AvailableMakeCommands, MakeServices } from "@larascript-framework/make";
import path from "path";
import MigrationFileService from "../domains/migrations/services/MigrationFilesService.js";

export default class MakeProvider extends BaseProvider {

    async register(): Promise<void> {
        
        const pathToTemplates = path.join(process.cwd(), '../../libs/make/src/make/templates')
        const pathToApp = path.join(process.cwd(),  'src/app')

        // Initialize the make services
        MakeServices.init({
            pathToApp,
            pathToTemplates,
            logger: app('logger'),
            migrationFileService: new MigrationFileService(),
        })

        // Register the make commands
        app('console').registerService().registerAll(
            AvailableMakeCommands.getCommands()
        )
    }

}
