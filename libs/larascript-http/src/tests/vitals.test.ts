import Controller from "@/http/base/Controller.js";
import Middleware from "@/http/base/Middleware.js";
import HttpContext from "@/http/context/HttpContext.js";
import HttpRouter from "@/http/router/HttpRouter.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { Request, Response } from "express";
import { TestHttpEnvironment } from "./helpers/TestHttpEnvironment.js";

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
    let serverPort: number;

    beforeEach(async () => {
        await TestHttpEnvironment.create().boot();

        httpService = TestHttpEnvironment.getInstance().httpService as HttpService;

        // Get the actual port the server is listening on
        serverPort = httpService.getPort()!;

        MiddlewareSingleton.getInstance().resetCounter();
    });
    
    afterEach(async () => {
        httpService.close();
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

            const response = await fetch(`http://localhost:${serverPort}/test`, {
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

            const response = await fetch(`http://localhost:${serverPort}/test`, {
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

            const response = await fetch(`http://localhost:${serverPort}/test`, {
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
                port: 0, // Use dynamic port allocation
                beforeAllMiddlewares: [beforeAllMiddleware],
                afterAllMiddlewares: [afterAllMiddleware],
            });
            httpService.init();
            await httpService.listen();
            
            // Update the server port for this test
            serverPort = httpService.getPort()!;

            const router = new HttpRouter();
            router.get('/test', (req: Request, res: Response) => {
                res.send({
                    message: 'test',
                });
            }, {
                middlewares: [requestMiddleware],
            });

            httpService.bindRoutes(router);
            const response = await fetch(`http://localhost:${serverPort}/test`, {
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

            const response = await fetch(`http://localhost:${serverPort}/test`, {
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

            const response = await fetch(`http://localhost:${serverPort}/test`, {
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

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'GET',
            });
            const body = await response.json() as { message: string };

            expect(response.status).toBe(200);
            expect(body.message).toBe('test123');
        })
    })
});
