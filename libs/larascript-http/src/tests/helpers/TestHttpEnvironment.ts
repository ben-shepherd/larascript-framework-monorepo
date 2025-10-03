import { testConfig } from "@/http/config/test.config.js";
import { HTTP_ENVIRONMENT_DEFAULTS, HttpEnvironment } from "@/http/environment/index.js";
import CsrfMiddleware from "@/http/middleware/CsrfMiddlware.js";
import HttpService from "@/http/services/HttpService.js";
import { AsyncSessionService } from "@larascript-framework/async-session";
import { IHttpConfig, IHttpServiceConfig } from "@larascript-framework/contracts/http";
import { aclConfig, authConfig, AuthEnvironment, IAuthEnvironmentConfig } from "@larascript-framework/larascript-auth";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { DatabaseEnvironment } from "@larascript-framework/larascript-database";
import { ValidatorServices } from "@larascript-framework/larascript-validator";

export const TEST_HTTP_ENVIRONMENT_DEFAULTS: IHttpConfig = {
    ...HTTP_ENVIRONMENT_DEFAULTS
};

export class TestHttpEnvironment extends BaseSingleton<IHttpConfig> {

    protected httpServiceConfig: IHttpServiceConfig = testConfig;

    static create(config: Partial<IHttpConfig> = TEST_HTTP_ENVIRONMENT_DEFAULTS) {
        config = {
            ...TEST_HTTP_ENVIRONMENT_DEFAULTS,
            ...config,
        }
        return TestHttpEnvironment.getInstance(config)
            .createHttpService();
    }

    withCsrf() {
        this.httpServiceConfig = {
            ...this.httpServiceConfig,
            beforeAllMiddlewares: [
                ...(this.httpServiceConfig.beforeAllMiddlewares ?? []),
                CsrfMiddleware.create(),
            ],
            csrf: {
                methods: ['POST', 'PUT', 'DELETE', 'PATCH'],
                headerName: 'X-CSRF-TOKEN',
                ttl: 60 * 60 * 1, // 1 hour
                exclude: ['/csrf'],
            }
        }

        return this;
    }

    withHttpServiceConfig(config: Partial<IHttpServiceConfig>) {
        this.httpServiceConfig = {
            ...this.httpServiceConfig,
            ...config,
        }
        return this;
    }

    createHttpService() {
        HttpEnvironment.getInstance(this.config!).httpService = new HttpService({
            ...this.httpServiceConfig
        });
        return this;
    }

    async boot() {


        await DatabaseEnvironment.create({
            boot: this.config!.databaseConfigured,
        }).boot();

        // Setup validator services
        ValidatorServices.init({
            queryBuilder: DatabaseEnvironment.getInstance().eloquentQueryBuilder,
            database: DatabaseEnvironment.getInstance().databaseService,
        });

        // Create the auth environment
        const authEnvirnonmentConfig: IAuthEnvironmentConfig = {
            authConfig: {
                ...authConfig,
                drivers: {
                    jwt: {
                        ...authConfig.drivers.jwt,
                        options: {
                            ...authConfig.drivers.jwt.options,
                            secret: 'test',
                            expiresInMinutes: 60 * 24, // 24 hours
                        }
                    }
                }
            },
            aclConfig: aclConfig,
            secretKey: 'test',
            dependencies: {
                asyncSessionService: AsyncSessionService.getInstance(),
            },
            dropAndCreateTables: true,
            boot: this.config!.databaseConfigured,
        }

        await AuthEnvironment.create(authEnvirnonmentConfig).boot();

        await HttpEnvironment.getInstance(this.config!).boot();
    }

}
