import express from "express";
import { ICsrfConfig } from "./ICSRF.js";
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
    csrf?: ICsrfConfig

}

export default IHttpServiceConfig