import { IDatabaseService, IEloquentQueryBuilderService } from "@/database/index.js";
import { IAsyncSessionService } from "@larascript-framework/async-session";
import { IAclConfig } from "@larascript-framework/larascript-acl";
import { IAuthConfig } from "./config.t.js";

export type IAuthEnvironmentConfig = {
    authConfig: IAuthConfig;
    aclConfig: IAclConfig;
    secretKey: string;
    dependencies: IAuthEnvironmentDependencies;
    boot?: boolean;
    dropAndCreateTables?: boolean;
}

export type IAuthEnvironmentDependencies = {
    databaseService: IDatabaseService;
    eloquentQueryBuilderService: IEloquentQueryBuilderService;
    asyncSessionService: IAsyncSessionService;
}