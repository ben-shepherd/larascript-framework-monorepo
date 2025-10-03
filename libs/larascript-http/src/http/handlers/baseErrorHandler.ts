import { IHttpServiceConfig } from "@larascript-framework/contracts/http";
import { appEnv, EnvironmentProduction } from "@larascript-framework/larascript-core";
import { NextFunction, Request, Response } from 'express';

export const baseErrorHandler = (config: IHttpServiceConfig) => (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (res.headersSent) {
        return next();
    }

    if(config.errorHandlers?.errorHandler) {
        return config.errorHandlers.errorHandler(err, req, res, next);
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode)

    if (appEnv() === EnvironmentProduction) {
        res.json({
            message: 'Whoops... something went wrong.',
        });
        return;
    }

    const formattedStack = err.stack
        ?.split('\n')
        .map(line => line.trim())
        .filter(Boolean);

    res.json({
        error: err.message,
        stack: formattedStack
    });
};