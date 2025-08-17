import { BaseAdapterTypes } from "@larascript-framework/larascript-core";
import { IAuthAdapter } from "@src/core/domains/auth/interfaces/adapter/IAuthAdapter";
import { IJwtAuthService } from "@src/core/domains/auth/interfaces/jwt/IJwtAuthService";

export type BaseAuthAdapterTypes =  BaseAdapterTypes<IAuthAdapter> & {
    default: IJwtAuthService
}