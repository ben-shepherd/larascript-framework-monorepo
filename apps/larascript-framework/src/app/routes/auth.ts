import { IExtendedAuthConfig } from "@src/config/auth.config";
import Route from "@src/core/domains/http/router/Route";
import Router from "@src/core/domains/http/router/Router";
import { IRouter } from "../../core/domains/http/interfaces/IRouter";
import AuthController from "../controllers/AuthController";
import AuthorizeMiddleware from "../middleware/auth/AuthorizeMiddleware";

export default (config: IExtendedAuthConfig): IRouter => {

    if (!config.http.routes.enabled) {
        return new Router();
    }

    return Route.group(router => {
        return router.group({
            prefix: '/auth',
            controller: AuthController,
            config: {
                adapter: 'jwt'
            }
        }, (router) => {
    
            if (config.http.routes.endpoints.login) {
                router.post('/login', 'login');
            }
    
            if (config.http.routes.endpoints.register) {
                router.post('/register', 'register');
            }
    
            router.group({
                middlewares: [AuthorizeMiddleware]
            }, (router) => {
    
                if (config.http.routes.endpoints.login) {
                    router.get('/user', 'user');
                }
    
                if (config.http.routes.endpoints.update) {
                    router.patch('/update', 'update');
                }
    
                if (config.http.routes.endpoints.refresh) {
                    router.post('/refresh', 'refresh');
                }
    
                if (config.http.routes.endpoints.logout) {
                    router.post('/logout', 'logout');
                }
    
            })
    
        })
        
    })
}
