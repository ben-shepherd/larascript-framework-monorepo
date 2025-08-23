import { CustomValidatorConstructor } from "@larascript-framework/larascript-validator";
import { AuthAdapterConstructor, IAuthAdapter } from "./adapter.t";

export interface IAuthDriverConfig<Adapter extends IAuthAdapter = IAuthAdapter> extends Record<string, unknown>{
    name: string;
    driver: AuthAdapterConstructor<Adapter>
    options: Record<string, unknown>
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
    drivers:  IAuthDriverConfig[]
}
