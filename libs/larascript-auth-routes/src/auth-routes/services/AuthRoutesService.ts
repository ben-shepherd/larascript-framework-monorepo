import { IHttpAuthRoutesConfig } from "@larascript-framework/contracts/auth";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { AuthorizeMiddleware, HttpRouter, IRouter } from "@larascript-framework/larascript-http";
import { TClassConstructor } from "@larascript-framework/larascript-utils";
import AuthController from "../controller/AuthController.js";

export class AuthRoutesService extends BaseSingleton<IHttpAuthRoutesConfig> {

    constructor(config: IHttpAuthRoutesConfig) {
        super(config);

        if (!config) {
            throw new Error("AuthRoutesService config is required");
        }
    }

    static create(config: IHttpAuthRoutesConfig) {
        return new AuthRoutesService(config);
    }

    getConfig(): IHttpAuthRoutesConfig {
        if(!this.config) {
            throw new Error('AuthRoutesService has not been created');
        }
        return this.config;
    }

    getAuthController(): TClassConstructor<AuthController> {
        return AuthController;
    }

    getRouter(): IRouter { 
        const config = this.getConfig()!;

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
}