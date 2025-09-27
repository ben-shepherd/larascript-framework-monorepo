import { IAuthService } from "@/auth/index.js";
import { IDatabaseService, IEloquentQueryBuilderService } from "@/database/index.js";
import { IAsyncSessionService } from "@larascript-framework/async-session";
import { EnvironmentType } from "@larascript-framework/larascript-core";
import { IRequestContext } from "./IRequestContext.js";
import { TUploadedFile } from "./UploadedFile.js";


export type IHttpConfig = {
    uploadDirectory: string;
    environment: EnvironmentType;
    dependencies: IHttpDependencies;
}

export type IHttpDependencies = {
    uploadService?: IHttpUploadService;
    requestContext?: IRequestContext;
    databaseService?: IDatabaseService;
    queryBuilderService?: IEloquentQueryBuilderService;
    loggerService?: IHttpLoggerService;
    asyncSession?: IAsyncSessionService;
    authService?: IAuthService;
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