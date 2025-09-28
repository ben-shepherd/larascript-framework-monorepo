import { IHttpAuthRoutesConfig } from "@larascript-framework/contracts/auth";
import { AuthorizeMiddleware, HttpRouter, IRouter } from "@larascript-framework/larascript-http";
import AuthController from "../controller/AuthController.js";


export default (config: IHttpAuthRoutesConfig): IRouter => {

    if (!config.http.routes.enabled) {
        return new HttpRouter();
    }

    return new HttpRouter().group(router => {
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
