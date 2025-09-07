import MigrationTypeEnum from "@/core/domains/migrations/enums/MigrationTypeEnum.js";
import MigrationError from "@/core/domains/migrations/exceptions/MigrationError.js";
import { IMigrationConfig } from "@/core/domains/migrations/interfaces/IMigrationConfig.js";
import { IMigrationService } from "@/core/domains/migrations/interfaces/IMigrationService.js";
import MigrationService from "@/core/domains/migrations/services/MigrationService.js";
import { BaseCommand } from "@larascript-framework/larascript-console";


abstract class BaseMigrationCommand extends BaseCommand {

    declare config: IMigrationConfig;

    /**
     * Constructor
     * @param config
     */
    constructor(config: IMigrationConfig = {}) {
        super(config);
        this.keepProcessAlive = config?.keepProcessAlive ?? this.keepProcessAlive;
    }

    /**
     * Get the migration service for schema migrations
     * @returns
     */
    getSchemaMigrationService(): IMigrationService {
        if(typeof this.config.schemaMigrationDir !== 'string') {
            throw new MigrationError('Schema migration directory is not set');
        }

        return new MigrationService({
            migrationType: MigrationTypeEnum.schema,
            directory: this.config.schemaMigrationDir,
            modelCtor: this.config.modelCtor,
        });
    }

    /**
     * Get the migration service for seeder migrations
     * @returns An instance of IMigrationService configured for seeder migrations
     */
    getSeederMigrationService(): IMigrationService {
        if(typeof this.config.seederMigrationDir !== 'string') {
            throw new MigrationError('Seeder migration directory is not set');
        }

        return new MigrationService({
            migrationType: MigrationTypeEnum.seeder,
            directory: this.config.seederMigrationDir,
            modelCtor: this.config.modelCtor,
        });
    }


}

export default BaseMigrationCommand
