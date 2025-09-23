import Controller from "@/http/base/Controller.js";
import Middleware from "@/http/base/Middleware.js";
import HttpContext from "@/http/context/HttpContext.js";
import RequestContext from "@/http/context/RequestContext.js";
import HttpRouter from "@/http/router/HttpRouter.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { AsyncSessionService } from "@larascript-framework/async-session";
import { IAuthService } from "@larascript-framework/contracts/auth";
import { IDatabaseService } from "@larascript-framework/contracts/database/database";
import { IEloquentQueryBuilderService } from "@larascript-framework/contracts/database/eloquent";
import { BaseSingleton, EnvironmentTesting } from "@larascript-framework/larascript-core";
import { LoggerService } from "@larascript-framework/larascript-logger";
import { IStorageService } from "@larascript-framework/larascript-storage";
import { Request, Response } from "express";
import path from "path";

class MiddlewareSingleton extends BaseSingleton {
    counter = 0;
    counterWithLabel: Record<string, number> = {}

    setLabelWithCurrentCounter(label: string) {
        this.counterWithLabel[label] = this.counter;
    }

    updateCounter() {
        this.counter++;
    }

    getCounter() {
        return this.counter;
    }

    resetCounter() {
        this.counter = 0;
    }
}

describe("httpService test suite", () => {
    let httpService: HttpService;

    beforeEach(async () => {

        httpService = new HttpService({
            enabled: true,
            port: 3000, 
            beforeAllMiddlewares: [],
        });
        
        const logger = new LoggerService({
            logPath: path.join(process.cwd(), "storage/logs"),
        });
        logger.boot();

        const asyncSession = new AsyncSessionService();

        Http.init({
            environment: EnvironmentTesting,
            httpConfig: {
                enabled: true,
                port: 3000, 
            },
            storage: {} as unknown as IStorageService,
            requestContext: new RequestContext(),
            logger: logger,
            asyncSession: asyncSession,
            authService: {} as unknown as IAuthService,
            databaseService: {} as unknown as IDatabaseService,
            queryBuilderService: {} as unknown as IEloquentQueryBuilderService,
        });
        httpService.init()

        await new Promise(resolve => setTimeout(resolve, 100));
        await httpService.listen();

        MiddlewareSingleton.getInstance().resetCounter();
    });

    afterEach(async () => {
        httpService.close();
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    describe("routes", () => {
        test("should be able to bind routes using express functions", async () => {
            const router = new HttpRouter();
            router.get('/test', (req: Request, res: Response) => {
                res.send({
                    message: 'test',
                });
            });

            httpService.bindRoutes(router);
            await httpService.listen();

            const response = await fetch('http://localhost:3000/test', {
                method: 'GET',
            });
            const body = await response.json() as { message: string };
            expect(response.status).toBe(200);
            expect(body.message).toBe('test');
            expect(httpService.getRegisteredRoutes()).not.toBeNull();
        })

        test("should be able to bind routes using controller", async () => {
            const controller = class TestController extends Controller {
                async invoke(context: HttpContext) {
                    this.jsonResponse({
                        message: 'test',
                    }, 200);
                }
            }

            const router = new HttpRouter();
            router.get('/test', controller);

            httpService.bindRoutes(router);
            await httpService.listen();

            const response = await fetch('http://localhost:3000/test', {
                method: 'GET',
            });
            const body = await response.json() as { message: string };
            expect(response.status).toBe(200);
            expect(body.message).toBe('test');
            expect(httpService.getRegisteredRoutes()).not.toBeNull();
        });

        test("should be able to bind routes using controller method", async () => {
            const controller = class TestController extends Controller {
                async testMethod(context: HttpContext) {
                    this.jsonResponse({
                        message: 'test',
                    }, 200);
                }
            }
            
            const router = new HttpRouter();
            router.get('/test', [controller, 'testMethod']);

            httpService.bindRoutes(router);
            await httpService.listen();

            const response = await fetch('http://localhost:3000/test', {
                method: 'GET',
            });
            const body = await response.json() as { message: string };
            expect(response.status).toBe(200);
            expect(body.message).toBe('test');
            expect(httpService.getRegisteredRoutes()).not.toBeNull();
        });
    })

    describe('middleware', () => {
        test("middlewares should be executed in the correct order", async () => {
            const beforeAllMiddleware = class extends Middleware {
                async execute(context: HttpContext) {
                    MiddlewareSingleton.getInstance().updateCounter();
                    MiddlewareSingleton.getInstance().setLabelWithCurrentCounter('beforeAllMiddleware');
                    this.next();
                }
            }
            const requestMiddleware = class extends Middleware {
                async execute(context: HttpContext) {
                    MiddlewareSingleton.getInstance().updateCounter();
                    MiddlewareSingleton.getInstance().setLabelWithCurrentCounter('requestMiddleware');
                    this.next();
                }
            }
            const afterAllMiddleware = class extends Middleware {
                async execute(context: HttpContext) {
                    MiddlewareSingleton.getInstance().updateCounter();
                    MiddlewareSingleton.getInstance().setLabelWithCurrentCounter('afterAllMiddleware');
                    this.next();
                }
            }

            httpService.close();
            httpService = new HttpService({
                enabled: true,
                port: 3000, 
                beforeAllMiddlewares: [beforeAllMiddleware],
                afterAllMiddlewares: [afterAllMiddleware],
            });
            httpService.init();
            await httpService.listen();

            const router = new HttpRouter();
            router.get('/test', (req: Request, res: Response) => {
                res.send({
                    message: 'test',
                });
            }, {
                middlewares: [requestMiddleware],
            });

            httpService.bindRoutes(router);
            const response = await fetch('http://localhost:3000/test', {
                method: 'GET',
            });
            const body = await response.json() as { message: string };

            expect(response.status).toBe(200);
            expect(body.message).toBe('test');
            expect(MiddlewareSingleton.getInstance().counterWithLabel).toEqual({
                beforeAllMiddleware: 1,
                requestMiddleware: 2,
                afterAllMiddleware: 3,
            });
        })
    })

    describe('asyncSession', () => {
        test("should be able to use async session to set data in middleware and use it in the controller", async () => {
            const router = new HttpRouter();
            router.get('/test', (req: Request, res: Response) => {
                const data = Http.getInstance().getAsyncSession().getSession().data;
                res.send({
                    message: data.test,
                });
            }, {
                middlewares: [
                    class extends Middleware {
                        async execute(context: HttpContext) {
                            const session = Http.getInstance().getAsyncSession().getSession();
                            session.data = {
                                test: 'test123',
                            };
                            this.next();
                        }
                    }
                ],
            });

            httpService.bindRoutes(router);

            const response = await fetch('http://localhost:3000/test', {
                method: 'GET',
            });
            const body = await response.json() as { message: string };

            expect(response.status).toBe(200);
            expect(body.message).toBe('test123');
        })
    })

    describe('request id', () => {
        test("should be able to get request id", async () => {
            const controller = class extends Controller {
                async invoke(context: HttpContext) {
                    this.jsonResponse({
                        id: context.getRequest().id,
                        message: 'test',
                    }, 200);
                }
            }

            const router = new HttpRouter();
            router.get('/test', controller);

            httpService.bindRoutes(router);

            const response = await fetch('http://localhost:3000/test', {
                method: 'GET',
            });
            const body = await response.json() as { message: string, id: string };

            expect(response.status).toBe(200);
            expect(body.message).toBe('test');
            expect(body.id).toBeDefined();
        })
    })

    describe('request context', () => {
        test("should be able to set and get request context in middleware and use it in the controller", async () => {
            const controller = class extends Controller {
                async invoke(context: HttpContext) {
                    const test = context.getByRequest<string>('contextKey');
                    this.jsonResponse({
                        message: test,
                    }, 200);
                }
            }

            const router = new HttpRouter();
            router.get('/test', controller, {
                middlewares: [
                    class extends Middleware {
                        async execute(context: HttpContext) {
                            context.setContext('contextKey', 'test123');
                            this.next();
                        }
                    }
                ],
            });

            httpService.bindRoutes(router);

            const response = await fetch('http://localhost:3000/test', {
                method: 'GET',
            });
            const body = await response.json() as { message: string };

            expect(response.status).toBe(200);
            expect(body.message).toBe('test123');
        })
    })
});
