import { UnauthorizedException } from '@larascript-framework/larascript-auth';
import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import responseError from '@src/core/domains/http/handlers/responseError';
import { auth } from '@src/core/services/AuthService';

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