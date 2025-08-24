import { IBasicACLService } from "@larascript-framework/larascript-acl";
import { IJwtAuthService, IUserRepository } from ".";
import { ApiTokenModelOptions, IApiTokenModel, IUserModel } from "./models.t";

export interface IAuthService {
  setAclService(aclService: IBasicACLService): void;
  acl(): IBasicACLService;
  boot(): Promise<void>;
  getJwt(): IJwtAuthService;
  check(): Promise<boolean>;
  user(): Promise<IUserModel | null>;
  getUserRepository(): IUserRepository;
}

export type SingleUseTokenOptions = Required<
  Pick<ApiTokenModelOptions, "expiresAfterMinutes">
>;

export interface IOneTimeAuthenticationService {
  setAuthService(authService: IAuthService): void;
  getScope(): string;
  createSingleUseToken(
    user: IUserModel,
    scopes?: string[],
    options?: SingleUseTokenOptions,
  ): Promise<string>;
  validateSingleUseToken(apiToken: IApiTokenModel): boolean;
}
