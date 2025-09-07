/* eslint-disable no-unused-vars */
import { TBaseRequest } from "@/core/domains/http/interfaces/BaseRequest.js";
import { TRouteItem } from "@/core/domains/http/interfaces/IRouter.js";
import { TUploadedFile } from "@/core/domains/http/interfaces/UploadedFile.js";
import { IApiTokenModel, IUserModel } from '@larascript-framework/larascript-auth';
import { IStorageFile } from '@larascript-framework/larascript-storage';
import { NextFunction, Response } from 'express';

export interface IHttpContext {
    getRouteItem(): TRouteItem | undefined;
    getUser(): IUserModel | undefined;
    getApiToken(): IApiTokenModel | undefined;
    getMethod(): string;
    getParams(): Record<string, string>;
    getParam(key: string): string | undefined;
    getQueryParam(key: string): string | undefined;
    getQueryParams(): Record<string, string>;
    getBody(): Record<string, string>;
    getByRequest<T = unknown>(key: string): T | undefined;
    setContext(key: string, value: unknown): void;
    getIpContext<T = unknown>(key: string): T | undefined;
    setIpContext(key: string, value: unknown, ttl?: number): void;
    getId(): string;
    getRequest(): TBaseRequest;
    getResponse(): Response;
    getNext(): NextFunction | undefined;
    getFile(key: string): TUploadedFile | undefined;
    getFiles(key: string): TUploadedFile[] | undefined;
    uploadFile(file: TUploadedFile): Promise<IStorageFile>;
    getValidatorBody(): Record<string, unknown>;
}

export interface IHasHttpContext {
    setHttpContext(context: IHttpContext): void;
    getHttpContext(): IHttpContext;
}