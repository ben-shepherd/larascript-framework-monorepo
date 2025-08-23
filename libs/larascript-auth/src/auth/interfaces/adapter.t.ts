import { BaseAdapterTypes } from "@larascript-framework/larascript-core";
import { IUserModel } from "./models.t";
import { IJwtAuthService } from "./service.t";

export type BaseAuthAdapterTypes =  BaseAdapterTypes<IAuthAdapter> & {
    default: IJwtAuthService
}

export interface AuthAdapterConstructor<T extends IAuthAdapter = IAuthAdapter> {
    new (config: ReturnType<T['getConfig']>): T;
}

export interface IAuthAdapter<Config extends Record<string, unknown> = Record<string, unknown>> {
    boot(): Promise<void>;
    getConfig(): Config;
    authorizeUser(user: IUserModel): void;
    user(): Promise<IUserModel | null>;
    check(): Promise<boolean>;
}




