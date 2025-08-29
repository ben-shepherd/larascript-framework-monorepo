import { IFactory } from "@larascript-framework/larascript-core";
import { IJSonWebToken } from "./jwt.t";
import { IApiTokenModel, IUserModel } from "./models.t";

export interface IUserFactoryConstructor {
  new (...args: any[]): IUserFactory;
}

export interface IApiTokenFactoryConstructor {
  new (...args: any[]): IApiTokenFactory;
}

export type IUserFactory = IFactory<IUserModel>;

export type IApiTokenFactory = IFactory<IApiTokenModel>;

export type IJwtFactory = IFactory<IJSonWebToken>;
