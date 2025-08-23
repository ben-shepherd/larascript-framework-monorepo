import { AuthAdapterConstructor, IApiTokenConstructor, IApiTokenRepositoryConstructor, IJwtAuthService, IUserConstructor, IUserRepositoryConstructor } from ".";
import { IAuthDriverConfig } from "./config.t";
import { IApiTokenFactoryConstructor, IUserFactoryConstructor } from "./factory";

export interface IJSonWebToken {
    uid: string;
    token: string;
    iat?: number;
    exp?: number;
}

export interface IJwtConfigOptions extends Record<string, unknown> {
    secret: string,
    expiresInMinutes: number;
    factory: {
        user: IUserFactoryConstructor;
        apiToken: IApiTokenFactoryConstructor;
    }
    models: {
        user?: IUserConstructor;
        apiToken?: IApiTokenConstructor;
    },
    repository: {
        user: IUserRepositoryConstructor;
        apiToken: IApiTokenRepositoryConstructor;
    }
}
export interface IJwtConfig extends IAuthDriverConfig<IJwtAuthService> {
    name: 'jwt';
    driver: AuthAdapterConstructor<IJwtAuthService>;
    options: IJwtConfigOptions
}
