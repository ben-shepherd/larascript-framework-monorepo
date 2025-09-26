import express from "express";
import { TExpressMiddlewareFnOrClass } from "./IMiddleware.js";

// eslint-disable-next-line no-unused-vars
export type ExtendExpressFn = (app: express.Application) => void

export interface IHttpServiceConfig {
    enabled: boolean;
    port: number;
    beforeAllMiddlewares?: (express.RequestHandler | TExpressMiddlewareFnOrClass)[];
    afterAllMiddlewares?: (express.RequestHandler | TExpressMiddlewareFnOrClass)[];
    currentRequestCleanupDelay?: number;
    extendExpress?: ExtendExpressFn
    csrf?: {
        methods?: string[];
        headerName?: string;
        ttl?: number;
        exclude?: string[];
    }
    logging?: {
        boundRouteDetails?: boolean;
        requests?: boolean;
    }

}

export default IHttpServiceConfig