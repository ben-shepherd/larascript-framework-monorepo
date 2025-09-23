import { IAsyncSessionService } from "@larascript-framework/async-session";
import { IAuthService } from "@larascript-framework/contracts/auth";
import { IDatabaseService } from "@larascript-framework/contracts/database/database";
import { IEloquentQueryBuilderService } from "@larascript-framework/contracts/database/eloquent";
import { IHttpConfig, IRequestContext } from "@larascript-framework/contracts/http";
import { IStorageService } from "@larascript-framework/contracts/storage";
import { BaseSingleton, EnvironmentType } from "@larascript-framework/larascript-core";
import { ILoggerService } from "@larascript-framework/larascript-logger";

export type HttpConfig = {
    httpConfig: IHttpConfig;
    storage: IStorageService;
    requestContext: IRequestContext;
    logger: ILoggerService;
    environment: EnvironmentType;
    asyncSession: IAsyncSessionService;
    authService: IAuthService;
    databaseService: IDatabaseService;
    queryBuilderService: IEloquentQueryBuilderService;
}

export default class Http extends BaseSingleton<HttpConfig> {
    
    static init(config: HttpConfig) {
        Http.getInstance(config);
    }

    getHttpConfig(): IHttpConfig {
        if(!this.config?.httpConfig) {
            throw new Error('Http config not configured');
        }
        return this.config?.httpConfig!;
    }

    getStorageService(): IStorageService {
        if(!this.config?.storage) {
            throw new Error('Storage service not configured');
        }
        return this.config?.storage!;
    }

    getRequestContext(): IRequestContext {
        if(!this.config?.requestContext) {
            throw new Error('Request context not configured');
        }
        return this.config?.requestContext!;
    }

    getLoggerService(): ILoggerService | undefined {
        return this.config?.logger;
    }

    getEnvironment(): EnvironmentType {
        if(!this.config?.environment) {
            throw new Error('Environment not configured');
        }
        return this.config?.environment!;
    }

    getAsyncSession(): IAsyncSessionService {
        if(!this.config?.asyncSession) {
            throw new Error('Async session not configured');
        }
        return this.config?.asyncSession!;
    }

    getAuthService(): IAuthService {
        if(!this.config?.authService) {
            throw new Error('Auth service not configured');
        }
        return this.config?.authService!;
    }

    getDatabaseService(): IDatabaseService {
        if(!this.config?.databaseService) {
            throw new Error('Database service not configured');
        }
        return this.config?.databaseService!;
    }

    getQueryBuilderService(): IEloquentQueryBuilderService {
        if(!this.config?.queryBuilderService) {
            throw new Error('Query builder service not configured');
        }
        return this.config?.queryBuilderService!;
    }
    
}
