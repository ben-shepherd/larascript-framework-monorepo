import { EnvironmentDevelopment } from "@larascript-framework/larascript-core";
import Middleware from "../base/Middleware.js";
import HttpContext from "../context/HttpContext.js";
import Http from "../services/Http.js";

/**
 * Middleware to log the request context
 */
class RequestContextLoggerMiddleware extends Middleware {

    async execute(context: HttpContext): Promise<void> {
        if (Http.getInstance().getEnvironment() !== EnvironmentDevelopment) {
            this.next()
            return;
        }

        context.getResponse().once('finish', () => {
            Http.getInstance().getLoggerService()?.info('requestContext: ', Http.getInstance().getRequestContext().getRequestContext())
            Http.getInstance().getLoggerService()?.info('ipContext: ', Http.getInstance().getRequestContext().getIpContext())
        })

        this.next()
    }

}


export default RequestContextLoggerMiddleware