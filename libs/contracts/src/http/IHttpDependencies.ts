import { EnvironmentType } from "@/core/environment.js";
import { ILoggerService } from "@/logger/index.js";
import { TUploadedFile } from "./UploadedFile.js";


export type IHttpEnvironmentConfig = {
    uploadDirectory: string;
    environment: EnvironmentType;
    databaseConfigured: boolean;
    authConfigured: boolean;
    currentRequestCleanupDelay?: number;
    dependencies?: {
        loggerService?: ILoggerService;
        uploadService?: IHttpUploadService;
    }
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