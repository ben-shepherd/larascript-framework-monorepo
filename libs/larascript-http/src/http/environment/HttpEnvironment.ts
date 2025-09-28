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
import RequestContextCleaner from "../context/RequestContextCleaner.js";

export const HTTP_ENVIRONMENT_DEFAULTS: IHttpConfig = {
    authConfigured: true,
    databaseConfigured: true,
    uploadDirectory: path.join(process.cwd(), 'storage/uploads'),
    environment: EnvironmentTesting,
    currentRequestCleanupDelay: 30
}

/**
 * Represents the HTTP environment configuration and services.
 * Extends the BaseSingleton class with IHttpConfig.
 */
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

    /**
     * Constructs an instance of HttpEnvironment with the given configuration.
     * @param {IHttpConfig} [config=HTTP_ENVIRONMENT_DEFAULTS] - The HTTP configuration settings.
     */
    constructor(config: IHttpConfig = HTTP_ENVIRONMENT_DEFAULTS) {
        super({
            ...HTTP_ENVIRONMENT_DEFAULTS,
            ...config,
        });

    }

    /**
     * Creates and configures an instance of HttpEnvironment.
     * @param {IHttpService} httpService - The HTTP service to be used.
     * @param {Partial<IHttpConfig>} [config=HTTP_ENVIRONMENT_DEFAULTS] - Partial configuration to override defaults.
     * @returns {HttpEnvironment} The configured HttpEnvironment instance.
     */
    static create(httpService: IHttpService, config: Partial<IHttpConfig> = HTTP_ENVIRONMENT_DEFAULTS) {
        config = {
            ...HTTP_ENVIRONMENT_DEFAULTS,
            ...config,
        }
        HttpEnvironment.getInstance(config).setPartialConfig(config);
        HttpEnvironment.getInstance(config).httpService = httpService;
        return HttpEnvironment.getInstance(config);

    }

    /**
     * Sets up the logger service for the environment.
     */
    setupLoggerService() {
        if (!this.config?.dependencies?.loggerService) {
            this.loggerService = this.config?.dependencies?.loggerService ?? new LoggerService({
                logPath: path.join(process.cwd(), "storage/logs"),
            });
            this.loggerService.boot();
        }

        this.loggerService = this.config?.dependencies?.loggerService!;
    }

    /**
     * Configures the upload directory for the HTTP environment.
     */
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

    /**
     * Updates the configuration with the provided partial configuration.
     * @param {Partial<IHttpConfig>} config - The partial configuration to apply.
     */
    setPartialConfig(config: Partial<IHttpConfig>) {
        this.config = {
            ...this.config!,
            ...config,
        };
    }

    /**
     * Boots the HTTP environment, initializing services and setting up configurations.
     * @returns {Promise<void>} A promise that resolves when the environment is booted.
     */
    async boot() {
        if(!this.httpService.getConfig()?.enabled) {
            return;
        }
        
        this.requestContext = new RequestContext();
        this.setupLoggerService();
        this.setUploadDirectory();

        await this.httpService.init();
        await this.httpService.listen();
        this.booted = true;

        /**
         * Start the RequestContextCleaner
        */
        RequestContextCleaner.boot({
            delayInSeconds: (this.config?.currentRequestCleanupDelay ?? HTTP_ENVIRONMENT_DEFAULTS.currentRequestCleanupDelay) as number
        })
    }

    /**
     * Closes the HTTP service and marks the environment as not booted.
     */
    close() {
        try {
            this.httpService.close();
            this.booted = false;
        }
        catch { }
    }

    /**
     * Checks if the database is configured.
     * @returns {boolean} True if the database is configured, otherwise false.
     */
    isDatabaseConfigured(): boolean {
        return this.config!.databaseConfigured;
    }

    /**
     * Checks if authentication is configured.
     * @returns {boolean} True if authentication is configured, otherwise false.
     */
    isAuthConfigured(): boolean {
        return this.config!.authConfigured
    }
}
