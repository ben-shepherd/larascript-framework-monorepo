import { testConfig } from "@/http/config/test.config.js";
import { HTTP_ENVIRONMENT_DEFAULTS, HttpEnvironment } from "@/http/environment/index.js";
import HttpService from "@/http/services/HttpService.js";
import { AsyncSessionService } from "@larascript-framework/async-session";
import { IHttpConfig } from "@larascript-framework/contracts/http";
import { aclConfig, authConfig, AuthEnvironment, IAuthEnvironmentConfig } from "@larascript-framework/larascript-auth";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { DatabaseEnvironment } from "@larascript-framework/larascript-database";

export const TEST_HTTP_ENVIRONMENT_DEFAULTS: IHttpConfig = {
    ...HTTP_ENVIRONMENT_DEFAULTS
};

export class TestHttpEnvironment extends BaseSingleton<IHttpConfig> {

    static create(config: Partial<IHttpConfig> = TEST_HTTP_ENVIRONMENT_DEFAULTS) {
        config = {
            ...TEST_HTTP_ENVIRONMENT_DEFAULTS,
            ...config,
        }
        return TestHttpEnvironment.getInstance(config);
    }

    async boot() {
        
        // Create the database environment
        await DatabaseEnvironment.create({
            boot: this.config!.databaseConfigured,
        }).boot();

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

        await HttpEnvironment.create(
            new HttpService({
                ...testConfig
            }),
            this.config!
        ).boot();
    }

}
