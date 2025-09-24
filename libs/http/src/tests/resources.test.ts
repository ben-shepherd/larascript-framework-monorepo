import RequestContext from "@/http/context/RequestContext.js";
import HttpRouter from "@/http/router/HttpRouter.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { beforeEach, describe, test } from "@jest/globals";
import { AsyncSessionService } from "@larascript-framework/async-session";
import { IAuthService } from "@larascript-framework/contracts/auth";
import { IDatabaseService } from "@larascript-framework/contracts/database/database";
import { IEloquentQueryBuilderService } from "@larascript-framework/contracts/database/eloquent";
import { EnvironmentTesting } from "@larascript-framework/larascript-core";
import { LoggerService } from "@larascript-framework/larascript-logger";
import { IStorageService } from "@larascript-framework/larascript-storage";
import path from "path";

describe("security test suite", () => {
    let httpService: HttpService;
    let serverPort: number;

    beforeEach(async () => {
        httpService = new HttpService({
            enabled: true,
            port: 0, // Use dynamic port allocation
            beforeAllMiddlewares: [],
        });

        const logger = new LoggerService({
            logPath: path.join(process.cwd(), "storage/logs"),
        });
        logger.boot();

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
            databaseService: {} as unknown as IDatabaseService,
            queryBuilderService: {} as unknown as IEloquentQueryBuilderService,
        });
        httpService.init()
        await httpService.listen();

        // Get the actual port the server is listening on
        serverPort = httpService.getPort()!;
    });

    describe("basic security rules", () => {
        test("should be able to use security rules when building routes", async () => {

            const router = new HttpRouter();
            router.resource({
                path: '/test',
                security: [
                    router.security().hasRole('admin'),
                ],
            });

        })
    })
});
