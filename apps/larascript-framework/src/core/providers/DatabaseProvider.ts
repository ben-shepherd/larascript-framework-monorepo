import { CryptoService } from "@larascript-framework/crypto-js";
import { BaseProvider } from "@larascript-framework/larascript-core";
import { DatabaseService, DB, EloquentQueryBuilderService, IDatabaseConfig } from "@larascript-framework/larascript-database";
import appConfig, { IAppConfig } from "@src/config/app.config";
import databaseConfig from "@src/config/database.config";
import { app } from "../services/App";

export default class TestDatabaseProvider extends BaseProvider {

    protected config: IDatabaseConfig = databaseConfig

    protected appConfig: IAppConfig = appConfig

    async register(): Promise<void> {

        const databaseService = new DatabaseService(this.config);
        databaseService.register();

        const eloquentQueryBuilder = new EloquentQueryBuilderService();

        const cryptoService = new CryptoService({
            secretKey: this.appConfig.appKey,
        });

        DB.init({
            databaseService,
            eloquentQueryBuilder,
            cryptoService,
            eventsService: app('events'),
            logger: app('logger'),
        });

        this.bind("db", databaseService);
        this.bind("query", eloquentQueryBuilder);
    }

    async boot(): Promise<void> {
        app('db').boot();
    }
}