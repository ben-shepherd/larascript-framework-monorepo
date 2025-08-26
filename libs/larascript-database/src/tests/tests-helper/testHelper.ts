import DatabaseConfig from "@/database/services/DatabaseConfig";
import DatabaseService from "@/database/services/DatabaseService";
import DB from "@/database/services/DB";
import EloquentQueryBuilderService from "@/eloquent/services/EloquentQueryBuilderService";
import { IModel, ModelConstructor } from "@/model";
import { PostgresAdapter } from "@/postgres/adapters";
import { extractDefaultPostgresCredentials } from "@/postgres/utils/extractDefaultPostgresCredentials";
import { CryptoService } from "@larascript-framework/crypto-js";
import { AppSingleton, BaseProvider, EnvironmentTesting, Kernel } from "@larascript-framework/larascript-core";
import { EventService, SyncDriver } from "@larascript-framework/larascript-events";
import { postgresDown } from "./postgres/postgresDown";
import { postgresUp } from "./postgres/postgresUp";

class TestPostgresProvider extends BaseProvider
{
    async register() {
        const databaseService = new DatabaseService({
            enableLogging: true,
            onBootConnect: true,
            defaultConnectionName: 'postgres',
            keepAliveConnections: '',
            connections: [
                DatabaseConfig.connection(
                    'postgres',
                    PostgresAdapter,
                    {
                        uri: extractDefaultPostgresCredentials() as string,
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

        DB.init({
            databaseService,
            eloquentQueryBuilder,
            cryptoService,
            eventsService
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
                new TestPostgresProvider(),
                // todo: add other connections (mongodb)
            ]
        }, {})
    },


    getTestConnectionNames: () => ['postgres'],

    beforeAll: async () => {
        await postgresDown()
        await postgresUp()
    },

    afterAll: async () => {
        await postgresDown()
    }
}

export const queryBuilder = <Model extends IModel>(model: ModelConstructor<Model>, connection?: string) => {
    return DB.getInstance().queryBuilder(model, connection)
}