import { IAsyncSessionService } from "@larascript-framework/async-session";
import { IAuthEnvironmentConfig, IAuthEnvironmentDependencies } from "@larascript-framework/contracts/auth";
import { aclConfig } from "./acl.config.js";
import { authConfig } from "./auth.config.js";

export const DEPENDENCIES_DEFAULTS: IAuthEnvironmentDependencies = {
    asyncSessionService: {} as IAsyncSessionService,
}

export const AUTH_ENVIRONMENT_DEFAULTS: IAuthEnvironmentConfig = {
    authConfig: authConfig,
    aclConfig: aclConfig,
    secretKey: '',
    dependencies: DEPENDENCIES_DEFAULTS,
    boot: true,
    dropAndCreateTables: false,
}