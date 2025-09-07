import Middleware from "@/core/domains/http/base/Middleware.js";
import { default as IExpressConfig, default as IHttpConfig } from "@/core/domains/http/interfaces/IHttpConfig.js";
import IHttpService from "@/core/domains/http/interfaces/IHttpService.js";
import { MiddlewareConstructor, TExpressMiddlewareFn, TExpressMiddlewareFnOrClass } from "@/core/domains/http/interfaces/IMiddleware.js";
import { IRoute, IRouter, TRouteItem } from "@/core/domains/http/interfaces/IRouter.js";
import EndRequestContextMiddleware from "@/core/domains/http/middleware/EndRequestContextMiddleware.js";
import RequestIdMiddleware from "@/core/domains/http/middleware/RequestIdMiddleware.js";
import StartSessionMiddleware from "@/core/domains/http/middleware/StartSessionMiddleware.js";
import Route from "@/core/domains/http/router/Route.js";
import RouterBindService from "@/core/domains/http/router/RouterBindService.js";
import { app } from "@/core/services/App.js";
import { logger } from "@/core/services/Logger.js";
import { BaseService } from '@larascript-framework/larascript-core';
import expressClient from 'express';



/**
 * Short hand for `app('http')`

 */
export const http = () => app('http');


/**
 * ExpressService class
 * Responsible for initializing and configuring ExpressJS
 * @implements IHttpService
 */
export default class HttpService extends BaseService<IHttpConfig> implements IHttpService {

    declare config: IExpressConfig | null;

    private readonly app: expressClient.Express

    private routerBindService!: RouterBindService;

    protected registeredRoutes: TRouteItem[] = []

    /**
     * Config defined in @/config/http/express.ts
     * @param config 
     */
    constructor(config: IExpressConfig | null = null) {
        super(config)
        this.routerBindService = new RouterBindService()
        this.app = expressClient()
    }

    public init() {
        if (!this.config) {
            throw new Error('Config not provided');
        }

        this.extendExpress()        
    }

    /**
     * Execute the extendExpress config option
     */
    protected extendExpress() {
        if(typeof this.config?.extendExpress === 'function') {
            this.config.extendExpress(this.app)
        }
    }

    /**
     * Returns the route instance.
     */
    public route(): IRoute {
        return new Route();
    }

    /**
     * Returns the registered routes.
     */
    public getRegisteredRoutes(): TRouteItem[] {
        return this.registeredRoutes
    }


    /**
     * Adds a middleware to the Express instance.
     * @param middleware - The middleware to add
     */
    public useMiddleware(middleware: TExpressMiddlewareFn | MiddlewareConstructor) {

        if (middleware.prototype instanceof Middleware) {
            this.app.use((middleware as MiddlewareConstructor).create())
        }
        else {
            this.app.use(middleware as TExpressMiddlewareFn)
        }

        logger().info('[ExpressService] middleware: ' + middleware.name)
    }

    /**
     * Starts listening for connections on the port specified in the config.
     * If no port is specified, the service will not start listening.
     */
    public async listen(): Promise<void> {
        const port = this.config?.port

        return new Promise(resolve => {
            this.app.listen(port, () => resolve())
        })
    }

    /**
     * Binds the routes to the Express instance.
     * @param router - The router to bind
     */
    public bindRoutes(router: IRouter): void {
        if (router.empty()) {
            return
        }

        const beforeAllMiddlewares = [
            RequestIdMiddleware.create(),
            StartSessionMiddleware.create(),
            EndRequestContextMiddleware.create(),
            ...(this.config?.beforeAllMiddlewares ?? []),
        ] as (expressClient.RequestHandler | TExpressMiddlewareFnOrClass)[]

        const afterAllMiddlewares = [
            ...(this.config?.afterAllMiddlewares ?? []),
        ]

        this.routerBindService.setExpress(this.app, this.config)
        this.routerBindService.setOptions({ beforeAllMiddlewares, afterAllMiddlewares })
        this.routerBindService.bindRoutes(router)
        this.registeredRoutes.push(...router.getRegisteredRoutes())
    }

    /**
     * Returns the Express instance.
     */
    public getExpress(): expressClient.Express {
        return this.app
    }

    /**
     * Checks if Express is enabled.
     * @returns true if enabled, false otherwise.
     */
    public isEnabled(): boolean {
        return this.config?.enabled ?? false
    }

}
