import HttpCodes from "@/http/data/HttpCodes.js";
import { DatabaseResourceRepository } from "@/http/resources/repository/DatabaseResourceRepository.js";
import HttpRouter from "@/http/router/HttpRouter.js";
import { beforeEach, describe, test } from "@jest/globals";
import { IUserModel } from "@larascript-framework/contracts/auth";
import { IHttpService, MiddlewareConstructor } from "@larascript-framework/contracts/http";
import { TestHttpEnvironment } from "./helpers/TestHttpEnvironment.js";
import { MockModel } from "./repository/MockModel.js";
import { resetMockModelTable } from "./repository/resetMockModelTable.js";

const headers = {
    "Content-Type": "application/json",
}

describe("resources test suite", () => {
    let httpService: IHttpService;
    let serverPort: number;
    let user: IUserModel;
    let MockAuthorizeMiddleware: MiddlewareConstructor;

    beforeEach(async () => {
        await TestHttpEnvironment.create({
            withDatabase: true,
        }).boot();

        httpService = TestHttpEnvironment.getInstance().httpService;

        await resetMockModelTable();

        user = await TestHttpEnvironment.getInstance().getAuthTestEnvironment().createUser({
            email: 'test@test.com',
            password: 'password'
        })
        MockAuthorizeMiddleware = TestHttpEnvironment.getInstance().createMockAuthorizeUserMiddleware(user);

        serverPort = httpService.getPort()!;
    });

    describe("configuration", () => {
        test("should be able configure a model datasource", async () => {
            const router = new HttpRouter();
            expect(
                () => router.resource({
                    prefix: '/test',
                    datasource: {
                        modelConstructor: MockModel,
                    }
                })
            ).not.toThrow();
        })

        test('should be able to configure a repository datasource', async () => {
            const router = new HttpRouter();
            expect(
                () => router.resource({
                    prefix: '/test',
                    datasource: {
                        repository: new DatabaseResourceRepository({
                            modelConstructor: MockModel,
                        }),
                    }
                })
            ).not.toThrow();
        })

        test("should throw an error if the resource owner attribute is not the same as the expected resource owner attribute", async () => {
            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                security: [
                    router.security().resourceOwner('notUserId'),
                ],
                middlewares: [
                    MockAuthorizeMiddleware,
                ]
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: 'Test',
                    age: 20,
                }),
            })

            const body = await response.json() as {
                error: string
            }

            expect(body.error).toBe('Expected the resource owner attribute to be userId but received notUserId')
            expect(response.status).toBe(HttpCodes.INTERNAL_SERVER_ERROR)
        })
    })

    describe("sensitive data", () => {
        test("should not show sensitive data in create response", async () => {
            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ]
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: 'Test',
                    age: 20,
                    secret: 'Secret',
                }),
            })

            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    secret?: string,
                }
            }

            expect(response.status).toBe(HttpCodes.CREATED)
            expect(body.data.secret).toBeUndefined();
        })

        test("should not show sensitive data in show response", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                secret: 'Secret',
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ]
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'GET',
                headers,
            })

            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    secret?: string,
                }
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.secret).toBeUndefined();
        })

        test("should not show sensitive data in update response", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                secret: 'Secret',
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ]
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    name: 'Test Updated',
                    age: 20,
                    secret: 'Secret Updated',
                }),
            })

            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    secret?: string,
                }
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.secret).toBeUndefined();
        })

        test("should not show sensitive data in index response", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                secret: 'Secret',
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ]
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'GET',
                headers,
            })

            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    secret?: string,
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(1)
            expect(body.data[0].secret).toBeUndefined();
        })
    })

    describe("meta data", () => {
        test("should include totalCount in index response", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                secret: 'Secret',
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ]
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'GET',
                headers,
            })

            const body = await response.json() as {
                meta: {
                    totalCount: number,
                }
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.meta.totalCount).toBe(1)
        })

        test("should include pagination metadata in index response", async () => {
            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ]
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'GET',
                headers,
            })

            const body = await response.json() as {
                meta: {
                    pagination: {
                        page: number,
                        pageSize: number,
                        nextPage: number,
                        previousPage: number,
                    }
                }
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.meta.pagination.page).toBe(1)
            expect(body.meta.pagination.pageSize).toBe(10)
        })
    })
});
