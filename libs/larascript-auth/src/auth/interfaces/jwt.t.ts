import { IAsyncSessionService } from "@larascript-framework/async-session";
import { ApiTokenModelOptions, IApiTokenModel, IApiTokenRepository, IApiTokenRepositoryConstructor, IAuthAdapter, IOneTimeAuthenticationService, IUserModel, IUserRepository, IUserRepositoryConstructor } from ".";
import { IBaseDriverConfig } from "./config.t";
import { IApiTokenFactory, IApiTokenFactoryConstructor, IUserFactory, IUserFactoryConstructor } from "./factory";

export interface IJSonWebToken {
    uid: string;
    token: string;
    iat?: number;
    exp?: number;
}

export interface IJwtAuthService extends IAuthAdapter<IJwtConfig> {
    attemptCredentials(email: string, password: string, scopes?: string[], options?: ApiTokenModelOptions): Promise<string>
    attemptAuthenticateToken(token: string): Promise<IApiTokenModel | null>
    refreshToken(apiToken: IApiTokenModel): string;
    revokeToken(apiToken: IApiTokenModel): Promise<void>
    revokeAllTokens(userId: string | number): Promise<void>
    getUserRepository(): IUserRepository
    getApiTokenRepository(): IApiTokenRepository
    getUserFactory(): IUserFactory
    getApiTokenFactory(): IApiTokenFactory
    createJwtFromUser(user: IUserModel, scopes?: string[], options?: ApiTokenModelOptions): Promise<string>
    oneTimeService(): IOneTimeAuthenticationService
    authorizeUser(user: IUserModel, scopes?: string[]): void
    logout(): void
    check(): Promise<boolean>
    user(): Promise<IUserModel | null>
    hashPassword(password: string): Promise<string>
    setAsyncSession(asyncSession: IAsyncSessionService): void
    getAsyncSession(): IAsyncSessionService
    buildApiTokenByUser(user: IUserModel, scopes?: string[], options?: ApiTokenModelOptions): Promise<IApiTokenModel>
}

export interface IJwtConfigOptions extends Record<string, unknown> {
    secret: string,
    expiresInMinutes: number;
    factory: {
        user: IUserFactoryConstructor;
        apiToken: IApiTokenFactoryConstructor;
    }
    repository: {
        user: IUserRepositoryConstructor;
        apiToken: IApiTokenRepositoryConstructor;
    }
}

export interface IJwtConfig extends IBaseDriverConfig<IJwtAuthService> {
    name: 'jwt';
    options: IJwtConfigOptions
}
