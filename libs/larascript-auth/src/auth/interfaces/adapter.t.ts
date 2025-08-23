import { BaseAdapterTypes } from "@larascript-framework/larascript-core";
import { IRouter } from "express";
import { IUserModel } from "./models.t";
import { IJwtAuthService } from "./service.t";

export type BaseAuthAdapterTypes =  BaseAdapterTypes<IAuthAdapter> & {
    default: IJwtAuthService
}

export interface IAuthAdapter<TConfig extends Record<string, unknown> = Record<string, unknown>> {
    boot(): Promise<void>;
    getConfig(): TConfig;
    setConfig(config: TConfig): void;
    getRouter(): IRouter;
    authorizeUser(user: IUserModel): void;
    user(): Promise<IUserModel | null>;
    check(): Promise<boolean>;
}




