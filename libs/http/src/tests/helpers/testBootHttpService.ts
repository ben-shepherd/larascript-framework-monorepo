import RequestContext from "@/http/context/RequestContext.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { AsyncSessionService } from "@larascript-framework/async-session";
import { IAuthService } from "@larascript-framework/contracts/auth";
import { IConsoleService } from "@larascript-framework/contracts/console";
import { CryptoService } from "@larascript-framework/crypto-js";
import { EnvironmentTesting } from "@larascript-framework/larascript-core";
import { DatabaseConfig, DatabaseService, DB, EloquentQueryBuilderService, IDatabaseService } from "@larascript-framework/larascript-database";
import { LoggerService } from "@larascript-framework/larascript-logger";
import { IStorageService } from "@larascript-framework/larascript-storage";
import path from "path";

export type Options = {
    withDatabase?: boolean;
}

export const testBootHttpService = async (options: Options = {}) => {
    const databaseService = new DatabaseService({
        defaultConnectionName: "postgres",
        keepAliveConnections: "",
        connections: [
            DatabaseConfig.postgres("postgres", {
                uri: "postgres://root:example@localhost:5432/app",
                options: {},
            }),
        ],
    });

    const logger = new LoggerService({
        logPath: path.join(process.cwd(), "storage/logs"),
    });
    logger.boot();
    
    DB.init({
        databaseService,
        eloquentQueryBuilder: new EloquentQueryBuilderService(),
        cryptoService: new CryptoService({
            secretKey: "test",
        }),
        dispatcher: () => Promise.resolve(),
        console: {} as unknown as IConsoleService,
        logger,
    });

    if (options.withDatabase) {
        DB.getInstance().databaseService().register();
        await DB.getInstance().databaseService().boot();
    }

    const asyncSession = new AsyncSessionService();

    Http.init({
        environment: EnvironmentTesting,
        httpConfig: {
            enabled: true,
            port: 0, // Use dynamic port allocation
        },
        storage: {} as unknown as IStorageService,
        requestContext: new RequestContext(),
        logger: logger,
        asyncSession: asyncSession,
        authService: {} as unknown as IAuthService,
        databaseService: options.withDatabase ? databaseService : {} as unknown as IDatabaseService,
        queryBuilderService: new EloquentQueryBuilderService(),
    });
    const httpService = new HttpService({
        enabled: true,
        port: 0, // Use dynamic port allocation
        beforeAllMiddlewares: [],
    });

    httpService.init()
    await httpService.listen();
}