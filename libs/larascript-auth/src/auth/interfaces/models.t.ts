import { IAccessControlEntity } from "@larascript-framework/larascript-acl";

export type ApiTokenModelOptions = Record<string, unknown> & {
    expiresAfterMinutes?: number
}

export interface IApiTokenAttributes {
    userId: string;
    token: string;
    scopes: string[];
    revokedAt: Date | null;
    expiresAt: Date | null;
}

export interface IUserAttributes {
    email: string;
    hashedPassword: string;
}

export interface IApiTokenConstructor<TApiToken extends IApiTokenModel = IApiTokenModel> {
    new (attributes?: TApiToken): TApiToken;
}

export interface IUserConstructor<TUser extends IUserModel = IUserModel> {
    new (attributes?: TUser): TUser;
}

export interface IApiTokenModel {
    getUserId(): string
    setUserId(userId: string): Promise<void>
    getUser(): Promise<IUserModel>
    getToken(): string
    setToken(token: string): Promise<void>
    getScopes(): string[]
    setScopes(scopes: string[]): Promise<void>
    hasScope(scopes: string | string[], exactMatch?: boolean): boolean
    getRevokedAt(): Date | null
    setRevokedAt(revokedAt: Date | null): Promise<void>
    setOptions(options: Record<string, unknown>): Promise<void>;
    getOptions<T extends ApiTokenModelOptions>(): T | null
    setExpiresAt(expiresAt: Date): Promise<void>
    getExpiresAt(): Date | null
    hasExpired(): boolean;

}

export interface IUserModel extends IAccessControlEntity{
    getId(): string;
    getEmail(): string | null;
    setEmail(email: string): Promise<void>;
    getHashedPassword(): string | null;
    setHashedPassword(hashedPassword: string): Promise<void>;
}
