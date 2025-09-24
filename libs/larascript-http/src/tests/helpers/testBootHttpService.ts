import RequestContext from "@/http/context/RequestContext.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { AsyncSessionService } from "@larascript-framework/async-session";
import { IAuthService } from "@larascript-framework/contracts/auth";
import { IStorageService } from "@larascript-framework/contracts/storage";
import { EnvironmentTesting } from "@larascript-framework/larascript-core";
import { EloquentQueryBuilderService, IDatabaseService } from "@larascript-framework/larascript-database";
import { ILoggerService } from "@larascript-framework/larascript-logger";
import { TestEnvironment } from "@larascript-framework/test-database";

export type Options = {
    withDatabase?: boolean;
}

export const testBootHttpService = async (options: Options = {}) => {
    await TestEnvironment.create().boot();

    const asyncSession = new AsyncSessionService();

    Http.init({
        environment: EnvironmentTesting,
        httpConfig: {
            enabled: true,
            port: 0, // Use dynamic port allocation
        },
        storage: {} as unknown as IStorageService,
        requestContext: new RequestContext(),
        logger: TestEnvironment.getInstance().logger ?? {} as unknown as ILoggerService,
        asyncSession: asyncSession,
        authService: {} as unknown as IAuthService,
        databaseService: options.withDatabase ? TestEnvironment.getInstance().databaseService : {} as unknown as IDatabaseService,
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