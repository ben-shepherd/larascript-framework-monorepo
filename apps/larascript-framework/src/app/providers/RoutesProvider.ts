import healthRoutes from "@/app/routes/health.js";
import BaseRoutesProvider from "@/core/http/abstract/BaseRoutesProvider.js";

import { app } from "@/core/services/App.js";
import { AuthRoutesService } from "@larascript-framework/larascript-auth-routes";


class RoutesProvider extends BaseRoutesProvider {

    /**
     * Registers the routes to the express service
     */
    public async boot(): Promise<void> {

        const httpService = app('http');
        
        // Bind routes
        httpService.bindRoutes(healthRoutes);
        httpService.bindRoutes(AuthRoutesService.getInstance().getRouter())
        // httpService.bindRoutes(CsrfMiddleware.getRouter())
        // httpService.bindRoutes(apiRoutes);

    }


}


export default RoutesProvider;