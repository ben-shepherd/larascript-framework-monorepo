import { aclConfig, authConfig, IAuthEnvironmentConfig } from "@/index.js";
import { AsyncSessionService } from "@larascript-framework/async-session";

export const testEnvironmentConfig: IAuthEnvironmentConfig = {
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
    boot: true,
}