import { databaseConfig } from "@/config/database.config.js";
import { IConsoleService } from "@larascript-framework/contracts/console";
import { CryptoService, ICryptoService } from "@larascript-framework/crypto-js";
import { ConsoleService } from "@larascript-framework/larascript-console";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { DatabaseService, DB, EloquentQueryBuilderService, IDatabaseConfig, IEloquentQueryBuilderService } from "@larascript-framework/larascript-database";
import { LoggerService } from "@larascript-framework/larascript-logger";
import path from "path";


export type Options = {
    withLogger: boolean;
    withConsole: boolean;
    withDatabase: boolean;
    withCrypto: boolean;
    withDispatcher: boolean;
    withEloquentQueryBuilder: boolean;
}

export const DEFAULTS: Options = {
    withLogger: true,
    withConsole: true,
    withDatabase: true,
    withCrypto: true,
    withDispatcher: true,
    withEloquentQueryBuilder: true,
}

export class TestDatabaseEnvironment extends BaseSingleton<Options>{
    databaseService!: DatabaseService;
    logger: LoggerService | undefined;
    console: IConsoleService | undefined;
    cryptoService: CryptoService | undefined;
    dispatcher!: (...args: any[]) => Promise<void>;
    eloquentQueryBuilder: EloquentQueryBuilderService | undefined;

    constructor(options: Options) {
        super({
            ...DEFAULTS,
            ...options,
        });
    }

    static create(options: Partial<Options> = {} as Partial<Options>) {
        return TestDatabaseEnvironment.getInstance(options);
    }
    
    withLogger() {
        this.logger = new LoggerService({
            logPath: path.join(process.cwd(), "storage/logs"),
        });
        this.logger.boot();
        return this;
    }

    withConsole() {
        this.console = new ConsoleService();
        return this;
    }

    withDatabase(config: IDatabaseConfig = databaseConfig) {
        this.databaseService = new DatabaseService(config);
        return this;
    }

    withCrypto() {
        this.cryptoService = new CryptoService({
            secretKey: "test",
        });
        return this;
    }

    withDispatcher() {
        this.dispatcher = () => Promise.resolve();
        return this;
    }

    withEloquentQueryBuilder() {
        this.eloquentQueryBuilder = new EloquentQueryBuilderService();
        return this;
    }

    applyWiths() {
        if (this.getConfig()?.withLogger) {
            this.withLogger();
        }
        if (this.getConfig()?.withConsole) {
            this.withConsole();
        }
        if (this.getConfig()?.withDatabase) {
            this.withDatabase();
        }
        if (this.getConfig()?.withCrypto) {
            this.withCrypto();
        }
        if (this.getConfig()?.withDispatcher) {
            this.withDispatcher();
        }
        if (this.getConfig()?.withEloquentQueryBuilder) {
            this.withEloquentQueryBuilder();
        }
    }

    async boot() {
        this.applyWiths();

        if(DB.getInstance().isInitialized()) {
            return;
        }

        DB.init({
            databaseService: this.databaseService,
            eloquentQueryBuilder: this.eloquentQueryBuilder ?? {} as unknown as IEloquentQueryBuilderService,
            cryptoService: this.cryptoService ?? {} as unknown as ICryptoService,
            dispatcher: this.dispatcher,
            console: this.console ?? {} as unknown as IConsoleService,
            logger: this.logger,
        });

        await this.connect();
    }

    async connect() {
        DB.getInstance().databaseService().register();
        await DB.getInstance().databaseService().boot();
    }

    async disconnect() {
        await DB.getInstance().databaseService().getAdapter().close();
    }

    async reconnect() {
        if(!DB.getInstance().isInitialized()) {
            return;
        }
        await this.disconnect();
        await this.connect();
    }

}