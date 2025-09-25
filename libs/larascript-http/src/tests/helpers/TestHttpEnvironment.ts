import Middleware from "@/http/base/Middleware.js";
import RequestContext from "@/http/context/RequestContext.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { AsyncSessionService, IAsyncSessionService } from "@larascript-framework/async-session";
import { IUserModel } from "@larascript-framework/contracts/auth";
import { IHttpContext, IHttpService, MiddlewareConstructor } from "@larascript-framework/contracts/http";
import { IStorageService } from "@larascript-framework/contracts/storage";
import { BaseSingleton, EnvironmentTesting } from "@larascript-framework/larascript-core";
import { IDatabaseService, IEloquentQueryBuilderService } from "@larascript-framework/larascript-database";
import { ILoggerService } from "@larascript-framework/larascript-logger";
import { TestAuthEnvironment } from "@larascript-framework/test-auth";
import { TestDatabaseEnvironment } from "@larascript-framework/test-database";

export type Options = {
    withDatabase?: boolean;
}

const DEFAULTS: Options = {
    withDatabase: true,
}

export class TestHttpEnvironment extends BaseSingleton<Options> {
    httpService!: IHttpService;
    asyncSession!: IAsyncSessionService;

    getAuthTestEnvironment(): TestAuthEnvironment {
        return TestAuthEnvironment.getInstance();
    }

    getDatabaseTestEnvironment(): TestDatabaseEnvironment {
        return TestDatabaseEnvironment.getInstance();
    }

    static create(options: Options = {}) {
        return TestHttpEnvironment.getInstance({
            ...DEFAULTS,
            ...options,
        });
    }
    
    async boot() {
        await TestDatabaseEnvironment.create({
            withDatabase: this.config?.withDatabase ?? DEFAULTS.withDatabase,
        }).boot();

        this.asyncSession = new AsyncSessionService();

        await TestAuthEnvironment.create({
            databaseService: TestDatabaseEnvironment.getInstance().databaseService,
            eloquentQueryBuilderService: TestDatabaseEnvironment.getInstance().eloquentQueryBuilder,
            asyncSessionService: this.asyncSession,
        }).boot();

        
        Http.init({
            environment: EnvironmentTesting,
            httpConfig: {
                enabled: true,
                port: 0, // Use dynamic port allocation
            },
            storage: {} as unknown as IStorageService,
            requestContext: new RequestContext(),
            logger: TestDatabaseEnvironment.getInstance().logger ?? {} as unknown as ILoggerService,
            asyncSession: this.asyncSession,
            authService: TestAuthEnvironment.getInstance().authService,
            databaseService: this.config?.withDatabase ? TestDatabaseEnvironment.getInstance().databaseService : {} as unknown as IDatabaseService,
            queryBuilderService: TestDatabaseEnvironment.getInstance().eloquentQueryBuilder ?? {} as unknown as IEloquentQueryBuilderService,
        });
        this.httpService = new HttpService({
            enabled: true,
            port: 0, // Use dynamic port allocation
            beforeAllMiddlewares: [],
        });
        this.httpService.init()
        await this.httpService.listen()
    }

    createMockAuthorizeUserMiddleware(user: IUserModel): MiddlewareConstructor {
        return class extends Middleware {
            async execute(context: IHttpContext): Promise<void> {
                await TestHttpEnvironment.getInstance().getAuthTestEnvironment().authorizeUser(user);
                this.next();
            }
        }
    }
}
