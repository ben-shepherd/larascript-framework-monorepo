/* eslint-disable no-unused-vars */
import express from "express";
import IExpressConfig from "./IHttpConfig.js";
import { IRoute, IRouter, TRouteItem } from "./IRouter.js";

export interface IHttpService {
    init(): void;
    bindRoutes(route: IRouter): void;
    getExpress(): express.Express;
    listen(): Promise<void>;
    getConfig(): IExpressConfig | null;
    isEnabled(): boolean;
    route(): IRoute;
    getRegisteredRoutes(): TRouteItem[];
}

export default IHttpService;