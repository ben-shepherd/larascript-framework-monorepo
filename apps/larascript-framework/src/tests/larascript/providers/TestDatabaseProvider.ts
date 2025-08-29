import { DatabaseConfig, IDatabaseConfig, IPostgresConfig, MongoDbAdapter, ParseMongoDBConnectionString, PostgresAdapter } from "@larascript-framework/larascript-database";
import { IMongoConfig } from "@larascript-framework/larascript-database/dist/mongodb/interfaces/IMongoConfig";
import ParsePostgresConnectionUrl from "@larascript-framework/larascript-database/dist/postgres/helper/ParsePostgresConnectionUrl";
import DatabaseProvider from "@src/core/providers/DatabaseProvider";


export const testDbName = 'test_db';

const defaultMongoDbCredentials = new MongoDbAdapter('', {} as IMongoConfig).getDefaultCredentials()
const defaultPostgresCredentials = new PostgresAdapter('', {} as IPostgresConfig).getDefaultCredentials()

if (!defaultMongoDbCredentials || !defaultPostgresCredentials) {
    throw new Error('Invalid default credentials');
}

const postgresConnectionStringWithTestDb: string = (() => {
    const parsed = ParsePostgresConnectionUrl.parse(defaultPostgresCredentials)
    parsed.database = testDbName;
    return parsed.toString()
})();

const mongoDbConnectionStringWithTestDb: string = (() => {
    const parsed = ParseMongoDBConnectionString.parse(defaultMongoDbCredentials)
    parsed.database = testDbName;
    return parsed.toString()
})();

export default class TestDatabaseProvider extends DatabaseProvider {

    protected config: IDatabaseConfig = {
        enableLogging: true,
        defaultConnectionName: 'postgres',
        keepAliveConnections: 'mongodb',
        connections: [
            DatabaseConfig.postgres('postgres', {
                uri: postgresConnectionStringWithTestDb,
                options: {}
            }),
            DatabaseConfig.mongodb('mongodb', {
                uri: mongoDbConnectionStringWithTestDb,
                options: {}
            })
        ]
    };

}