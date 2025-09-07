import BaseMigration from "@/core/domains/migrations/base/BaseMigration.js";
import { MigrationType } from "@/core/domains/migrations/interfaces/IMigration.js";

/**
 * BaseSeeder class serves as the foundation for all database seeders.
 */
abstract class BaseSeeder extends BaseMigration {

    /**
     * The type of migration
     */
    migrationType = 'seeder' as MigrationType;

    /**
     * Optional down method.
     *
     * @return {Promise<void>}
     */
    down(): Promise<void> {
        return Promise.resolve();
    }

}

export default BaseSeeder;