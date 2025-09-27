import { IDatabaseService, IEloquentQueryBuilderService } from "@/database/index.js";
import { IAsyncSessionService } from "@larascript-framework/async-session";
import { EnvironmentType } from "@larascript-framework/larascript-core";
import { IRequestContext } from "./IRequestContext.js";
import { TUploadedFile } from "./UploadedFile.js";

export type IHttpUser = {
    getId(): string;
}

export type IHttpConfig = {
    uploadDirectory: string;
    environment: EnvironmentType;
    dependencies: IHttpDependencies;
}

export type IHttpDependencies = {
    authService?: IHttpAuthService;
    uploadService?: IHttpUploadService;
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

export type IHttpFileSystemUploaderConfig = {
    uploadsDirectory: string;
}

export type IHttpUploadService = {
    setConfig(config: IHttpFileSystemUploaderConfig): void;
    moveUploadedFile(file: TUploadedFile): Promise<TUploadedFile>;
}