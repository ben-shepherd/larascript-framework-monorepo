import { IDatabaseService, IEloquentQueryBuilderService } from "@/database/index.js";
import { IStorageService } from "@/storage/IStorageService.js";
import { IAsyncSessionService } from "@larascript-framework/async-session";
import { EnvironmentType } from "@larascript-framework/larascript-core";
import { IRequestContext } from "./IRequestContext.js";
import { TUploadedFile } from "./UploadedFile.js";

export type IHttpUser = {
    getId(): string;
}

export type IHttpConfig = {
    environment: EnvironmentType;
    dependencies: IHttpDependencies;
}

export type IHttpDependencies = {
    authService?: IHttpAuthService;
    storageService: IStorageService;
    requestContext?: IRequestContext;
    databaseService?: IDatabaseService;
    queryBuilderService?: IEloquentQueryBuilderService;
    loggerService?: IHttpLoggerService;
    asyncSession?: IAsyncSessionService;
}

export type IHttpAuthService = {
    check(): Promise<boolean>;
    user(): Promise<IHttpUser | null>;
}

export type IHttpLoggerService = {
    info(...args: any[]): void;
    error(...args: any[]): void;
}

export type IHttpUploadService = {
    moveUploadedFile(file: TUploadedFile): Promise<void>;
}