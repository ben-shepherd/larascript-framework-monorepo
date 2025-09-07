import Middleware from '@/core/domains/http/base/Middleware.js';
import HttpContext from '@/core/domains/http/context/HttpContext.js';
import responseError from '@/core/domains/http/handlers/responseError.js';
import { auth } from '@/core/services/AuthService.js';
import { UnauthorizedException } from '@larascript-framework/larascript-auth';

type OneTimeTokenMiddlewareOptions = {
    validateContainsOneTimeScope?: boolean;
}

class OneTimeTokenMiddleware extends Middleware<OneTimeTokenMiddlewareOptions> {

    async execute(context: HttpContext): Promise<void> {
        try {
            const apiToken = context.getApiToken()

            if (!apiToken) {
                throw new UnauthorizedException()
            }

            if (this.config?.validateContainsOneTimeScope && !auth().getJwt().oneTimeService().validateSingleUseToken(apiToken)) {
                throw new UnauthorizedException()
            }

            await auth().getJwt().revokeToken(apiToken)

            this.next();
        }
        catch (error) {
            if (error instanceof UnauthorizedException) {
                responseError(context.getRequest(), context.getResponse(), error, 401)
            }
        }
    }



}

export default OneTimeTokenMiddleware;