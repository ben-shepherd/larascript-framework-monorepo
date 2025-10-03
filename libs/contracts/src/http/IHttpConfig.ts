import express, { NextFunction, Request, Response } from "express";
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
    errorHandlers?: {
        notFoundHandler?: (req: Request, res: Response, next: NextFunction) => void;
        errorHandler?: (err: Error, req: Request, res: Response, next: NextFunction) => void;
    },
    disableErrorHandlers?: boolean;
}

export default IHttpServiceConfig