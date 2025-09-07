import Middleware from "@/core/domains/http/base/Middleware.js";
import HttpContext from "@/core/domains/http/context/HttpContext.js";
import { app, appEnv } from "@/core/services/App.js";
import { EnvironmentDevelopment } from "@larascript-framework/larascript-core";

/**
 * Middleware to log the request context
 */
class RequestContextLoggerMiddleware extends Middleware {

    async execute(context: HttpContext): Promise<void> {
        if (appEnv() !== EnvironmentDevelopment) {
            this.next()
            return;
        }

        context.getResponse().once('finish', () => {
            app('logger').info('requestContext: ', app('requestContext').getRequestContext())
            app('logger').info('ipContext: ', app('requestContext').getIpContext())
        })

        this.next()
    }

}


export default RequestContextLoggerMiddleware