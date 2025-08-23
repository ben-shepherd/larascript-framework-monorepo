import { IBasicACLService } from "@larascript-framework/larascript-acl";
import { IRouter } from "express";
import { IAuthAdapter, IJwtConfigOptions, IUserRepository } from ".";
import { ApiTokenModelOptions, IApiTokenModel, IUserModel } from "./models.t";

export interface IAuthService {
    setAclService(aclService: IBasicACLService): void;
    acl(): IBasicACLService;
    boot(): Promise<void>
    getJwt(): IJwtAuthService;
    check(): Promise<boolean>
    user(): Promise<IUserModel | null>
    getUserRepository(): IUserRepository
}

export interface IJwtAuthService extends IAuthAdapter<IJwtConfigOptions> {
    attemptCredentials(email: string, password: string, scopes?: string[], options?: ApiTokenModelOptions): Promise<string>
    attemptAuthenticateToken(token: string): Promise<IApiTokenModel | null>
    refreshToken(apiToken: IApiTokenModel): string;
    revokeToken(apiToken: IApiTokenModel): Promise<void>
    revokeAllTokens(userId: string | number): Promise<void>
    getRouter(): IRouter
    getUserRepository(): IUserRepository
    createJwtFromUser(user: IUserModel, scopes?: string[], options?: ApiTokenModelOptions): Promise<string>
    getCreateUserTableSchema(): Record<string, unknown>
    getCreateApiTokenTableSchema(): Record<string, unknown>
    oneTimeService(): IOneTimeAuthenticationService
    authorizeUser(user: IUserModel): void
    check(): Promise<boolean>
    user(): Promise<IUserModel | null>
}

export type SingleUseTokenOptions = Required<Pick<ApiTokenModelOptions, 'expiresAfterMinutes'>>

export interface IOneTimeAuthenticationService {
    getScope(): string;
    createSingleUseToken(user: IUserModel, scopes?: string[], options?: SingleUseTokenOptions): Promise<string>;
    validateSingleUseToken(apiToken: IApiTokenModel): boolean;
}
