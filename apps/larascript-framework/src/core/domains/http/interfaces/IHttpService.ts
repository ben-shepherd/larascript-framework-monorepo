/* eslint-disable no-unused-vars */
import IExpressConfig from "@/core/domains/http/interfaces/IHttpConfig.js";
import { IRoute, IRouter, TRouteItem } from "@/core/domains/http/interfaces/IRouter.js";
import express from "express";

export default interface IHttpService {
    init(): void;
    bindRoutes(route: IRouter): void;
    getExpress(): express.Express;
    listen(): Promise<void>;
    getConfig(): IExpressConfig | null;
    isEnabled(): boolean;
    route(): IRoute;
    getRegisteredRoutes(): TRouteItem[];
}