import Middleware from "@/core/domains/http/base/Middleware.js";
import HttpContext from "@/core/domains/http/context/HttpContext.js";
import responseError from "@/core/domains/http/handlers/responseError.js";

class ValidationMiddleware extends Middleware<{ scopes: string[] }> {

    async execute(context: HttpContext): Promise<void> {
        try {

            
        }
        catch (error) {

            if(error instanceof Error) {
                responseError(context.getRequest(), context.getResponse(), error)
                return;
            } 
        }
    }

}

export default ValidationMiddleware;