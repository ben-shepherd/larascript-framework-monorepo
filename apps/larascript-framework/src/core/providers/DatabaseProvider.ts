import appConfig, { IAppConfig } from "@/config/app.config.js";
import databaseConfig from "@/config/database.config.js";
import { BaseProvider } from "@larascript-framework/larascript-core";
import { DatabaseService, DB, EloquentQueryBuilderService, IDatabaseConfig } from "@larascript-framework/larascript-database";
import { app } from "../services/App.js";

export default class TestDatabaseProvider extends BaseProvider {

    protected config: IDatabaseConfig = databaseConfig

    protected appConfig: IAppConfig = appConfig

    async register(): Promise<void> {

        const databaseService = new DatabaseService(this.config);
        databaseService.register();

        const eloquentQueryBuilder = new EloquentQueryBuilderService();
        
        DB.init({
            databaseService: databaseService,
            eloquentQueryBuilder:eloquentQueryBuilder,
            cryptoService: app('crypto'),
            dispatcher: (...args: any[]) => app('events').dispatch(...args) as Promise<void>,
            logger: app('logger'),
            console: app('console'),
        });

        this.bind("db", DB.getInstance().databaseService());
        this.bind("query", DB.getInstance().queryBuilderService());
    }

    async boot(): Promise<void> {
        await DB.getInstance().databaseService().boot();
    }
}