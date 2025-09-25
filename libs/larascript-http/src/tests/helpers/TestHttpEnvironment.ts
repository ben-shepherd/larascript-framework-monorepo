import RequestContext from "@/http/context/RequestContext.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { AsyncSessionService, IAsyncSessionService } from "@larascript-framework/async-session";
import { IAuthService } from "@larascript-framework/contracts/auth";
import { IHttpService } from "@larascript-framework/contracts/http";
import { IStorageService } from "@larascript-framework/contracts/storage";
import { BaseSingleton, EnvironmentTesting } from "@larascript-framework/larascript-core";
import { IDatabaseService, IEloquentQueryBuilderService } from "@larascript-framework/larascript-database";
import { ILoggerService } from "@larascript-framework/larascript-logger";
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
            authService: {} as unknown as IAuthService,
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
}
