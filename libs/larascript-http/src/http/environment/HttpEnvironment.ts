import HttpFileSystemUploader from "@/http/services/HttpFileSystemUploader.js";
import { AsyncSessionService, IAsyncSessionService } from "@larascript-framework/async-session";
import { IAuthService } from "@larascript-framework/contracts/auth";
import { IHttpConfig, IHttpService, IHttpUploadService, IRequestContext } from "@larascript-framework/contracts/http";
import { AuthEnvironment } from "@larascript-framework/larascript-auth";
import { BaseSingleton, EnvironmentTesting, EnvironmentType } from "@larascript-framework/larascript-core";
import { DatabaseEnvironment, IDatabaseService, IEloquentQueryBuilderService } from "@larascript-framework/larascript-database";
import { ILoggerService, LoggerService } from "@larascript-framework/larascript-logger";
import path from "path";
import RequestContext from "../context/RequestContext.js";

export const HTTP_ENVIRONMENT_DEFAULTS: IHttpConfig = {
    authConfigured: true,
    databaseConfigured: true,
    uploadDirectory: path.join(process.cwd(), 'storage/uploads'),
    environment: EnvironmentTesting
}

export class HttpEnvironment extends BaseSingleton<IHttpConfig> {
    httpService!: IHttpService;
    requestContext!: IRequestContext;
    loggerService!: ILoggerService;
    uploadService!: IHttpUploadService;
    booted!: boolean;

    get environment(): EnvironmentType {
        return this.config?.environment ?? HTTP_ENVIRONMENT_DEFAULTS.environment;
    }

    get authEnvironment(): AuthEnvironment {
        return AuthEnvironment.getInstance();
    }

    get databaseEnvironment(): DatabaseEnvironment {
        return DatabaseEnvironment.getInstance();
    }

    get asyncSession(): IAsyncSessionService {
        return AsyncSessionService.getInstance();
    }

    get authService(): IAuthService {
        return this.authEnvironment.authService
    }

    get databaseService(): IDatabaseService {
        return this.databaseEnvironment.databaseService
    }

    get queryBuilderService(): IEloquentQueryBuilderService {
        return this.databaseEnvironment.eloquentQueryBuilder
    }

    constructor(config: IHttpConfig = HTTP_ENVIRONMENT_DEFAULTS) {
        super({
            ...HTTP_ENVIRONMENT_DEFAULTS,
            ...config,
        });

    }

    static create(httpService: IHttpService, config: Partial<IHttpConfig> = HTTP_ENVIRONMENT_DEFAULTS) {
        config = {
            ...HTTP_ENVIRONMENT_DEFAULTS,
            ...config,
        }
        HttpEnvironment.getInstance(config).setPartialConfig(config);
        HttpEnvironment.getInstance(config).httpService = httpService;
        return HttpEnvironment.getInstance(config);

    }

    setupLoggerService() {
        if (!this.config?.dependencies?.loggerService) {
            this.loggerService = this.config?.dependencies?.loggerService ?? new LoggerService({
                logPath: path.join(process.cwd(), "storage/logs"),
            });
            this.loggerService.boot();
        }

        this.loggerService = this.config?.dependencies?.loggerService!;
    }

    setUploadDirectory() {
        if (typeof this.uploadService === 'undefined') {
            this.uploadService = new HttpFileSystemUploader({
                uploadsDirectory: this.config!.uploadDirectory,
            });
            return;
        }

        this.uploadService?.setConfig({
            uploadsDirectory: this.config!.uploadDirectory,
        });
    }

    setPartialConfig(config: Partial<IHttpConfig>) {
        this.config = {
            ...this.config!,
            ...config,
        };
    }

    async boot() {
        this.requestContext = new RequestContext();
        this.setupLoggerService();
        this.setUploadDirectory();

        await this.httpService.init();
        await this.httpService.listen();
        this.booted = true;
    }

    close() {
        try {
            this.httpService.close();
            this.booted = false;
        }
        catch { }
    }

    isDatabaseConfigured(): boolean {
        return this.config!.databaseConfigured;
    }

    isAuthConfigured(): boolean {
        return this.config!.authConfigured
    }
}
