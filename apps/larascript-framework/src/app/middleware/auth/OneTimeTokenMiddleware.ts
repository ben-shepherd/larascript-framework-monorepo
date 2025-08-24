import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import { authJwt } from '@src/core/domains/auth/services/JwtAuthService';
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
                throw new UnauthorizedError()
            }

            if (this.config?.validateContainsOneTimeScope && !authJwt().oneTimeService().validateSingleUseToken(apiToken)) {
                throw new UnauthorizedError()
            }

            await auth().getJwtAdapter().revokeToken(apiToken)

            this.next();
        }
        catch (error) {
            if (error instanceof UnauthorizedError) {
                responseError(context.getRequest(), context.getResponse(), error, 401)
            }
        }
    }



}

export default OneTimeTokenMiddleware;