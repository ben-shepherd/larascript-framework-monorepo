import { IMigrationConfig } from "@/core/domains/migrations/interfaces/IMigrationConfig.js";
import MigrationProvider from "@/core/domains/migrations/providers/MigrationProvider.js";
import TestMigrationModel from "@/tests/larascript/migration/models/TestMigrationModel.js";

class TestMigrationProvider extends MigrationProvider {

    protected config: IMigrationConfig = {
        keepProcessAlive: true,
        schemaMigrationDir: '@/../src/tests/larascript/migration/migrations',
        seederMigrationDir: '@/../src/tests/larascript/migration/seeders',
        modelCtor: TestMigrationModel
    }
    
}

export default TestMigrationProvider