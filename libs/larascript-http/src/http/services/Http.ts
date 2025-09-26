import { IHttpConfig, IHttpDependencies, IHttpServiceConfig } from "@larascript-framework/contracts/http";
import { BaseSingleton } from "@larascript-framework/larascript-core";

export default class Http extends BaseSingleton<IHttpConfig> {
    
    static init(config: IHttpConfig) {
        Http.getInstance(config);
    }

    get dependencies(): IHttpDependencies {
        if(!this.config?.dependencies) {
            throw new Error('Dependencies not configured');
        }
        return this.config?.dependencies!;
    }

    getHttpConfig(): IHttpServiceConfig {
        if(!this.config?.httpConfig) {
            throw new Error('Http config not configured');
        }
        return this.config?.httpConfig!;
    }

    getStorageService(): IHttpDependencies['storageService'] {
        if(!this.dependencies?.storageService) {
            throw new Error('Storage service not configured');
        }
        return this.dependencies?.storageService!;
    }

    getRequestContext(): IHttpDependencies['requestContext'] {
        if(!this.dependencies?.requestContext) {
            throw new Error('Request context not configured');
        }
        return this.dependencies?.requestContext!;
    }

    getLoggerService(): IHttpDependencies['loggerService'] {
        return this.dependencies?.loggerService;
    }

    getEnvironment(): IHttpConfig['environment'] {
        if(!this.config?.environment) {
            throw new Error('Environment not configured');
        }
        return this.config?.environment!;
    }

    getAsyncSession(): IHttpDependencies['asyncSession'] {
        if(!this.dependencies?.asyncSession) {
            throw new Error('Async session not configured');
        }
        return this.dependencies?.asyncSession!;
    }

    getAuthService(): IHttpDependencies['authService'] {
        if(!this.dependencies?.authService) {
            throw new Error('Auth service not configured');
        }
        return this.dependencies?.authService!;
    }

    getDatabaseService(): IHttpDependencies['databaseService'] {
        if(!this.dependencies?.databaseService) {
            throw new Error('Database service not configured');
        }
        return this.dependencies?.databaseService!;
    }

    getQueryBuilderService(): IHttpDependencies['queryBuilderService'] {
        if(!this.dependencies?.queryBuilderService) {
            throw new Error('Query builder service not configured');
        }
        return this.dependencies?.queryBuilderService!;
    }
    
}
