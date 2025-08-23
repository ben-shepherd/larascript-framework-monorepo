import { IFactory } from "@larascript-framework/larascript-core";
import { IJSonWebToken } from "./jwt.t";
import { IApiTokenModel, IUserModel } from "./models.t";

export type IUserFactory = IFactory<IUserModel>

export type IApiTokenFactory = IFactory<IApiTokenModel>

export type IJwtFactory = IFactory<IJSonWebToken>