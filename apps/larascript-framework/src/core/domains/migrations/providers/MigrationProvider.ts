import MigrateDownCommand from "@/core/domains/migrations/commands/MigrateDownCommand.js";
import MigrateFreshCommand from "@/core/domains/migrations/commands/MigrateFreshCommand.js";
import MigrateUpCommand from "@/core/domains/migrations/commands/MigrateUpCommand.js";
import SeedDownCommand from "@/core/domains/migrations/commands/SeedDownCommand.js";
import SeedUpCommand from "@/core/domains/migrations/commands/SeedUpCommand.js";
import { IMigrationConfig } from "@/core/domains/migrations/interfaces/IMigrationConfig.js";
import { app } from "@/core/services/App.js";
import { BaseProvider } from "@larascript-framework/larascript-core";

/**
 * MigrationProvider class handles all migration related tasks
 */
class MigrationProvider extends BaseProvider {

    protected config: IMigrationConfig = {
        schemaMigrationDir: '@/../src/app/migrations',
        seederMigrationDir: '@/../src/app/seeders',
    };
    
    async register(): Promise<void> {
        this.log('Registering MigrationProvider');   

        // Register the migration commands
        app('console').registerService()
            .registerAll([
                MigrateUpCommand,
                MigrateDownCommand,
                MigrateFreshCommand,
                SeedUpCommand,
                SeedDownCommand,
            ], this.config)
    }

}

export default MigrationProvider
