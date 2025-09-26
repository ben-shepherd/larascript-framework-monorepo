import { AsyncSessionService } from "@larascript-framework/async-session";
import { IHttpConfig, IHttpDependencies, IHttpService, IHttpServiceConfig } from "@larascript-framework/contracts/http";
import { BaseSingleton } from "@larascript-framework/larascript-core";

export default class Http extends BaseSingleton<IHttpConfig> {

    private httpService!: IHttpService;

    private booted: boolean = false;

    static init(service: IHttpService, config: IHttpConfig): Http {
        Http.getInstance(config);
        Http.getInstance().setHttpService(service);
        return Http.getInstance();
    }

    static close() {
        try {
            Http.getInstance().getHttpService().close();
            Http.getInstance().booted = false;
        }
        catch { }
    }

    setHttpService(httpService: IHttpService) {
        this.httpService = httpService;
    }

    async boot() {
        await this.httpService.init();
        await this.httpService.listen();
        this.booted = true;
    }

    isBooted(): boolean {
        return this.booted;
    }

    get dependencies(): IHttpDependencies {
        if (!this.config?.dependencies) {
            throw new Error('Dependencies not configured');
        }
        return this.config?.dependencies!;
    }

    getHttpService(): IHttpService {
        if (!this.httpService) {
            throw new Error('Http service not configured');
        }
        return this.httpService!;
    }

    getHttpConfig(): IHttpServiceConfig {
        if (!this.httpService.getConfig()) {
            throw new Error('Http config not configured');
        }
        return this.httpService.getConfig()!;
    }

    getStorageService(): IHttpDependencies['storageService'] {
        if (!this.dependencies?.storageService) {
            throw new Error('Storage service not configured');
        }
        return this.dependencies?.storageService!;
    }

    getRequestContext(): IHttpDependencies['requestContext'] {
        if (!this.dependencies?.requestContext) {
            throw new Error('Request context not configured');
        }
        return this.dependencies?.requestContext!;
    }

    getLoggerService(): IHttpDependencies['loggerService'] {
        return this.dependencies?.loggerService;
    }

    getEnvironment(): IHttpConfig['environment'] {
        if (!this.config?.environment) {
            throw new Error('Environment not configured');
        }
        return this.config?.environment!;
    }

    getAsyncSession(): NonNullable<IHttpDependencies['asyncSession']> {
        if (!this.dependencies?.asyncSession) {
            this.dependencies.asyncSession = new AsyncSessionService();
        }
        return this.dependencies?.asyncSession!;
    }

    getAuthService(): IHttpDependencies['authService'] {
        if (!this.dependencies?.authService) {
            throw new Error('Auth service not configured');
        }
        return this.dependencies?.authService!;
    }

    getDatabaseService(): IHttpDependencies['databaseService'] {
        if (!this.dependencies?.databaseService) {
            throw new Error('Database service not configured');
        }
        return this.dependencies?.databaseService!;
    }

    getQueryBuilderService(): IHttpDependencies['queryBuilderService'] {
        if (!this.dependencies?.queryBuilderService) {
            throw new Error('Query builder service not configured');
        }
        return this.dependencies?.queryBuilderService!;
    }

}
