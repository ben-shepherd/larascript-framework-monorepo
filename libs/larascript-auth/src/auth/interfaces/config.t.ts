import { CustomValidatorConstructor } from "@larascript-framework/larascript-validator";
import { IAuthAdapter } from "./adapter.t";
import { IApiTokenConstructor, IUserConstructor } from "./models.t";

export interface IAuthDriverConfig<Options extends Record<string, unknown> = Record<string, unknown>> {
    name: string;
    driver: new (options?: Options) => IAuthAdapter<Options>;
    options: Options
}

export interface IAuthConfig {
    http: {
        enabled: boolean;
        endpoints: {
            register: boolean;
            login: boolean;
            update: boolean;
            refresh: boolean;
            logout: boolean;
        },
        validators?: {
            createUser?: CustomValidatorConstructor;
            updateUser?: CustomValidatorConstructor;
        };
    }
    models?: {
        user?: IUserConstructor;
        apiToken?: IApiTokenConstructor;
    },
    drivers:  IAuthDriverConfig[]
}
