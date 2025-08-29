import { IPostgresConfig, PostgresAdapter } from "@larascript-framework/larascript-database";
import ParsePostgresConnectionUrl from "@larascript-framework/larascript-database/dist/postgres/helper/ParsePostgresConnectionUrl";
import testHelper from "@src/tests/testHelper";
import pg from 'pg';

(async () => {

    const handlePostgres = async () => {
        const dbToDrop = testHelper.getTestDbName()
        const defaultPostgresCredentials = new PostgresAdapter('', {} as IPostgresConfig).getDefaultCredentials()
    
        if(!defaultPostgresCredentials) {
            throw new Error('Invalid default credentials');
        }
        
        const credentials = ParsePostgresConnectionUrl.parse(defaultPostgresCredentials);
        
        const client = new pg.Client({
            user: credentials.username,
            password: credentials.password,
            host: credentials.host,
            port: credentials.port,
            database: 'postgres'
        });
    
        try {
            await client.connect();
            await client.query(`DROP DATABASE IF EXISTS "${dbToDrop}"`)
        }
        catch (err) {
            console.error('Failed to drop test db', err)
        }
        finally {
            await client.end();
        }    
    }

    await handlePostgres();
    // await hamdleMongodb();

})();