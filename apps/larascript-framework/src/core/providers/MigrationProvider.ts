import { IMigrationConfig } from "@/core/domains/migrations/interfaces/IMigrationConfig.js";
import { app } from "@/core/services/App.js";
import { BaseProvider } from "@larascript-framework/larascript-core";
import { AvailableMigrationCommands } from "@larascript-framework/larascript-database";

/**
 * MigrationProvider class handles all migration related tasks
 */
class MigrationProvider extends BaseProvider {

    protected config: IMigrationConfig = {
        schemaMigrationDir: 'src/app/migrations',
        seederMigrationDir: 'src/app/seeders',
    };
    
    async register(): Promise<void> {
        app('console').registerService()
            .registerAll(AvailableMigrationCommands.getCommands(), this.config)
    }

}

export default MigrationProvider
