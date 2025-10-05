import { IAsyncSessionService } from "@larascript-framework/async-session";
import { IAclConfig } from "@larascript-framework/larascript-acl";
import { EnvironmentType } from "@larascript-framework/larascript-core";
import { IAuthConfig } from "./config.t.js";

export type IAuthEnvironmentConfig = {
    environment: EnvironmentType;
    authConfig: IAuthConfig;
    aclConfig: IAclConfig;
    secretKey: string;
    dependencies: IAuthEnvironmentDependencies;
    boot?: boolean;
    dropAndCreateTables?: boolean;
}

export type IAuthEnvironmentDependencies = {
    asyncSessionService: IAsyncSessionService;
}