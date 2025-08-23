import { IApiTokenConstructor, IJwtAuthService, IUserConstructor } from ".";
import { IAuthDriverConfig } from "./config.t";

export interface IJSonWebToken {
    uid: string;
    token: string;
    iat?: number;
    exp?: number;
}

export interface IJwtConfigOptions extends Record<string, unknown> {
    secret: string,
    expiresInMinutes: number;
    models: {
        user?: IUserConstructor;
        apiToken?: IApiTokenConstructor;
    }
}
export interface IJwtConfig extends IAuthDriverConfig<IJwtConfigOptions> {
    name: 'jwt';
    driver: new (options?: IJwtConfigOptions) => IJwtAuthService;
    options: IJwtConfigOptions
}
