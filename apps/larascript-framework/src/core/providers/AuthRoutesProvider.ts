import { BaseRoutesProvider } from "@src/core/domains/http/providers/BaseRoutesProvider";
import { app } from "../services/App";

class AuthRoutesProvider extends BaseRoutesProvider {

    public async boot(): Promise<void> {

        const httpService = app('http');
        httpService.bindRoutes(authJwt().getRouter())

    }
}

export default AuthRoutesProvider;