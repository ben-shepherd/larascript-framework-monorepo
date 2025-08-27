import DatabaseConfig from "@/database/services/DatabaseConfig";
import DatabaseService from "@/database/services/DatabaseService";
import DB from "@/database/services/DB";
import EloquentQueryBuilderService from "@/eloquent/services/EloquentQueryBuilderService";
import { IModel, ModelConstructor } from "@/model";
import { MongoDbAdapter } from "@/mongodb/adapters";
import { extractDefaultMongoCredentials } from "@/mongodb/utils/extractDefaultMongoCredentials";
import { PostgresAdapter } from "@/postgres/adapters";
import { extractDefaultPostgresCredentials } from "@/postgres/utils/extractDefaultPostgresCredentials";
import { CryptoService } from "@larascript-framework/crypto-js";
import { AppSingleton, BaseProvider, EnvironmentTesting, Kernel } from "@larascript-framework/larascript-core";
import { EventService, SyncDriver } from "@larascript-framework/larascript-events";
import { LoggerService } from "@larascript-framework/larascript-logger";
import path from "path";

class TestDatabaseProvider extends BaseProvider
{
    async register() {
        const databaseService = new DatabaseService({
            enableLogging: true,
            onBootConnect: true,
            defaultConnectionName: 'postgres',
            keepAliveConnections: 'mongodb',
            connections: [
                DatabaseConfig.connection(
                    'postgres',
                    PostgresAdapter,
                    {
                        uri: extractDefaultPostgresCredentials() as string,
                        options: {}
                    }
                ),
                DatabaseConfig.connection(
                    'mongodb',
                    MongoDbAdapter,
                    {
                        uri: extractDefaultMongoCredentials() as string,
                        options: {}
                    }
                )
            ]
        })
        databaseService.register()

        const eloquentQueryBuilder = new EloquentQueryBuilderService()
        const cryptoService = new CryptoService({
            secretKey: 'test'
        })
        const eventsService = new EventService({
            defaultDriver: SyncDriver,
            drivers: {
                sync: {
                    driver: SyncDriver,
                    options: {}
                }
            },
            listeners: []
        })

        const logger = new LoggerService({
            logPath: path.join(process.cwd(), 'storage/logs')
        })
        await logger.boot()

        DB.init({
            databaseService,
            eloquentQueryBuilder,
            cryptoService,
            eventsService,
            logger
        })

        this.bind('events', eventsService)
        this.bind('db', databaseService)
    }

    async boot() {
        await AppSingleton.container('db').boot()
    }
}

export const testHelper = {
    testBootApp: async () => {
        await Kernel.boot({
            environment: EnvironmentTesting,
            providers: [
                new TestDatabaseProvider(),
            ]
        }, {})
    },


    getTestConnectionNames: () => ['mongodb', 'postgres'],

    afterAll: async () => {
        await postgresDown()
        await mongodbDown()
    }
}

export const queryBuilder = <Model extends IModel>(model: ModelConstructor<Model>, connection?: string) => {
    return DB.getInstance().queryBuilder(model, connection)
}

function mongodbUp() {
    const { execSync } = require('child_process');
    try {
        // Change directory to project root and run the command
        execSync('pnpm run db:mongodb:up', {
            stdio: 'inherit',
            cwd: process.cwd(),
        });
    } catch (error) {
        console.error('Failed to start Postgres with pnpm db:mongodb:up');
        throw error;
    }
}

function mongodbDown() {
    const { execSync } = require('child_process');
    try {
        // Change directory to project root and run the command
        execSync('pnpm run db:mongodb:down', {
            stdio: 'inherit',
            cwd: process.cwd(),
        });
    } catch (error) {
        console.error('Failed to start Postgres with pnpm db:mongodb:down');
        throw error;
    }
}


export const postgresUp = () => {
    const { execSync } = require('child_process');
    try {
        // Change directory to project root and run the command
        execSync('pnpm run db:postgres:up', {
            stdio: 'inherit',
            cwd: process.cwd(),
        });
    } catch (error) {
        console.error('Failed to start Postgres with pnpm db:postgres:up');
        throw error;
    }
}

export const postgresDown = () => {
    const { execSync } = require('child_process');
    try {
        // Change directory to project root and run the command
        execSync('pnpm run db:postgres:down', {
            stdio: 'inherit',
            cwd: process.cwd(),
        });
    } catch (error) {
        console.error('Failed to start Postgres with pnpm db:postgres:up');
        throw error;
    }
}