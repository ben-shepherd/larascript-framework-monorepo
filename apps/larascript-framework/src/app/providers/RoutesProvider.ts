import authRoutes from "@src/app/routes/auth";
import { authConfig, IExtendedAuthConfig } from "@src/config/auth.config";
import BaseRoutesProvider from "@src/core/domains/http/providers/BaseRoutesProvider";
import healthRoutes from "@src/core/domains/http/routes/healthRoutes";
import { app } from "@src/core/services/App";


class RoutesProvider extends BaseRoutesProvider {

    protected authConfig: IExtendedAuthConfig = authConfig;

    /**
     * Registers the routes to the express service
     */
    public async boot(): Promise<void> {

        const httpService = app('http');
        
        // Bind routes
        httpService.bindRoutes(healthRoutes);
        httpService.bindRoutes(authRoutes(this.authConfig))
        // httpService.bindRoutes(CsrfMiddleware.getRouter())
        // httpService.bindRoutes(apiRoutes);

    }


}


export default RoutesProvider;