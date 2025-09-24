import Middleware from "../base/Middleware.js";
import HttpContext from "../context/HttpContext.js";
import Http from "../services/Http.js";

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
            Http.getInstance().getRequestContext().endRequestContext(context.getRequest())
        })

        this.next()
    }

}

export default EndRequestContextMiddleware