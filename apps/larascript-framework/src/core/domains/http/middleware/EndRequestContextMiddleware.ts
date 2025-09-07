import Middleware from "@/core/domains/http/base/Middleware.js";
import HttpContext from "@/core/domains/http/context/HttpContext.js";
import { app } from "@/core/services/App.js";

/**
 * Middleware that ends the current request context and removes all associated values.
 */
class EndRequestContextMiddleware extends Middleware {

    /**
     * Executes the end request context middleware
     * 
     * @param context - The HTTP context containing request and response objects
     */
    async execute(context: HttpContext): Promise<void> {
        context.getResponse().once('finish', () => {
            app('requestContext').endRequestContext(context.getRequest())
        })

        this.next()
    }

}

export default EndRequestContextMiddleware