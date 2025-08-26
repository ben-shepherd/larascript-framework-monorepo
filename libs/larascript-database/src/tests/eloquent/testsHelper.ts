import { EnvironmentTesting, Kernel } from "@larascript-framework/larascript-core";

import { BaseProvider, KernelConfig } from "@larascript-framework/larascript-core";

class TestDatabaseProvider extends BaseProvider
{
    async register(): Promise<void> {
        // const databaseService = new DatabaseService({
        //     enableLogging: true,
        //     defaultConnection: 'test',
        //     connections: [
        //         DatabaseConfig.connection('postgres', MockSQLAdapter, MockSQLConfig), // postgres
        //         DatabaseConfig.connection('postgres', MockSQLAdapter, MockSQLConfig), // mongodb
        //     ]
        // })
    }
}


export const testBootApp = async () => {

    const config: KernelConfig = {
        environment: EnvironmentTesting,
        providers: [
            new TestDatabaseProvider(),
        ]
    }

    await Kernel.boot(config, {});
}