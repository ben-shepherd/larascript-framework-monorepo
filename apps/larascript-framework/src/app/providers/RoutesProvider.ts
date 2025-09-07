import authRoutes from "@/app/routes/auth.js";
import { authConfig, IExtendedAuthConfig } from "@/config/auth.config.js";
import BaseRoutesProvider from "@/core/domains/http/providers/BaseRoutesProvider.js";
import healthRoutes from "@/core/domains/http/routes/healthRoutes.js";
import { app } from "@/core/services/App.js";


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