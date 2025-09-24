import Controller from "@/http/base/Controller.js";
import HttpContext from "@/http/context/HttpContext.js";
import RequestContext from "@/http/context/RequestContext.js";
import { ALWAYS, ScopeRuleConfig, SecurityEnum } from "@/http/index.js";
import HttpRouter from "@/http/router/HttpRouter.js";
import SecurityReader from "@/http/security/services/SecurityReader.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { AsyncSessionService } from "@larascript-framework/async-session";
import { IAuthService } from "@larascript-framework/contracts/auth";
import { IDatabaseService } from "@larascript-framework/contracts/database/database";
import { IEloquentQueryBuilderService } from "@larascript-framework/contracts/database/eloquent";
import { EnvironmentTesting } from "@larascript-framework/larascript-core";
import { LoggerService } from "@larascript-framework/larascript-logger";
import { IStorageService } from "@larascript-framework/larascript-storage";
import path from "path";

describe("httpService test suite", () => {
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

    describe("security", () => {
        test("should be able to use security rules when building routes", async () => {
            const controller = class extends Controller {
                async invoke(context: HttpContext) {
                    const routeItem = context.getRouteItem();
                    const securityRule = SecurityReader.find(routeItem!, SecurityEnum.ENABLE_SCOPES, [ALWAYS])
                    const options = securityRule?.getRuleOptions() as ScopeRuleConfig;
 
                    expect(securityRule).not.toBeNull();
                    expect(options?.scopes).toBe('test');
                    expect(options?.exactMatch).toBe(true);
 
                    return context.getResponse().send({
                        scopes: options?.scopes,
                        exactMatch: options?.exactMatch,
                    });
                }
            }

            const router = new HttpRouter();
            router.get('/test', controller, {
                security: [
                    router.security().scopes('test', true),
                ],
            });

            httpService.bindRoutes(router);
            await httpService.listen();

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'GET',
            });
            const body = await response.json() as { scopes: string, exactMatch: boolean };
            expect(response.status).toBe(200);
            expect(body.scopes).toBe('test');
            expect(body.exactMatch).toBe(true);
            expect(httpService.getRegisteredRoutes()).not.toBeNull();
        })
    })
});
