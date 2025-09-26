import HttpCodes from "@/http/data/HttpCodes.js";
import { DatabaseResourceRepository } from "@/http/resources/repository/DatabaseResourceRepository.js";
import HttpRouter from "@/http/router/HttpRouter.js";
import { beforeEach, describe, test } from "@jest/globals";
import { IUserModel } from "@larascript-framework/contracts/auth";
import { IHttpService, MiddlewareConstructor } from "@larascript-framework/contracts/http";
import { generateUuidV4 } from "@larascript-framework/larascript-utils";
import { BaseCustomValidator, IRulesObject, NumberRule, RequiredRule, StringRule } from "@larascript-framework/larascript-validator";
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
    })

    describe("create resource", () => {
        test("should not be able to create a resource while not being authenticated", async () => {
            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
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

            expect(response.status).toBe(401)
        })

        test("should be able to create a resource while authenticated", async () => {
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
                }),
            })

            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number
                }
            }
            expect(body.data.id).toBeDefined()
            expect(body.data.name).toBe('Test')
            expect(body.data.age).toBe(20)
            expect(response.status).toBe(201)
        })

        test("should not be able to create a resource if validation fails", async () => {
            const createValidator = class extends BaseCustomValidator {
                protected rules: IRulesObject = {
                    name: [new RequiredRule(), new StringRule()],
                    age: [new RequiredRule(), new NumberRule()],
                }
            }

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                validation: {
                    create: createValidator,
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
                    name: undefined,
                    age: undefined,
                }),
            })
            const body = await response.json() as {
                data: {
                    errors: Record<string, string[]>
                }
            }

            expect(response.status).toBe(422)
            expect(body.data.errors.name).toBeDefined()
            expect(body.data.errors.age).toBeDefined()
        })

        test("should add the owner's id to the resource", async () => {

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                security: [
                    router.security().resourceOwner('userId'),
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
                    age: 20
                }),
            })
            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    userId: string,
                    age: number
                }
            }

            expect(response.status).toBe(201)
            expect(body.data.name).toBe('Test')
            expect(body.data.age).toBe(20)
            expect(body.data.userId).toBe(user.getId())
        })
    });

    describe("update resource", () => {
        test("should not be able to update a resource while not being authorized", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    name: 'Test Updated',
                    age: 20
                }),
            })

            expect(response.status).toBe(401)
        })

        test("should be able to update a resource while being authorized", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
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
                    age: 20
                }),
            })

            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    userId: string,
                    age: number
                }
            }

            expect(response.status).toBe(200)
            expect(body.data.name).toBe('Test Updated')
        })

        test("should not be able to update a resource if validation fails", async () => {
            const createValidator = class extends BaseCustomValidator {
                protected rules: IRulesObject = {
                    name: [new RequiredRule(), new StringRule()],
                    age: [new RequiredRule(), new NumberRule()],
                }
            }

            const model = await MockModel.create({
                name: 'Test',
                age: 20,
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
                ],
                validation: {
                    update: createValidator,
                }
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    name: undefined,
                    age: undefined,
                }),
            })

            const body = await response.json() as {
                data: {
                    errors: Record<string, string[]>
                }
            }

            expect(response.status).toBe(HttpCodes.UNPROCESSABLE_ENTITY)
            expect(body.data.errors.name).toBeDefined()
            expect(body.data.errors.age).toBeDefined()
        })


        test("should be able to update a resource if it is owned by the user", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: user.getId(),
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
                ],
                security: [
                    router.security().resourceOwner('userId'),
                ],
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    name: 'Test Updated',
                    age: 20
                }),
            })

            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    userId: string,
                    age: number
                }
            }

            expect(response.status).toBe(200)
            expect(body.data.name).toBe('Test Updated')
            expect(body.data.userId).toBe(user.getId())
        })

        test("should not be able to update a resource if it is not owned by the user", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: 'not-user-id',
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
                ],
                security: [
                    router.security().resourceOwner('userId'),
                ],
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    name: 'Test Updated',
                    age: 20
                }),
            })
            expect(response.status).toBe(HttpCodes.FORBIDDEN)
        })
    })

    describe("delete resource", () => {
        test("should not be able to delete a resource while not being authorized", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                }
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'DELETE',
                headers,
            })
            const foundModel = await MockModel.query().where('id', model.getId()).first();

            expect(foundModel).toBeDefined()
            expect(response.status).toBe(HttpCodes.UNAUTHORIZED)
        })

        test("should be able to delete a resourc while being authorized", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20
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
                method: 'DELETE',
                headers,
            })
            const foundModel = await MockModel.query().where('id', model.getId()).first();

            expect(foundModel).toBeNull()
            expect(response.status).toBe(200)
        })

        test("should not be able to delete a resource if validation fails", async () => {
            const createValidator = class extends BaseCustomValidator {
                protected rules: IRulesObject = {
                    name: [new RequiredRule(), new StringRule()],
                    age: [new RequiredRule(), new NumberRule()],

                }
            }

            const model = await MockModel.create({
                name: 'Test',
                age: 20
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
                ],
                validation: {
                    delete: createValidator,
                }
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'DELETE',
                headers,
            })
            const body = await response.json() as {
                data: {
                    errors: Record<string, string[]>
                }
            }
            const foundModel = await MockModel.query().where('id', model.getId()).first();

            expect(foundModel).toBeDefined()
            expect(response.status).toBe(HttpCodes.UNPROCESSABLE_ENTITY)
            expect(body.data.errors.name).toBeDefined()
            expect(body.data.errors.age).toBeDefined()
        })

        test("should be able to delete a resource if it is owned by the user", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: user.getId(),
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
                ],
                security: [
                    router.security().resourceOwner('userId'),
                ],
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'DELETE',
                headers,
            })
            const foundModel = await MockModel.query().where('id', model.getId()).first();

            expect(response.status).toBe(200)
            expect(foundModel).toBeNull()
        })

        test("should not be able to delete a resource if it is not owned by the user", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: 'not-user-id',
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
                ],
                security: [
                    router.security().resourceOwner('userId'),
                ],
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'DELETE',
                headers,
            })
            const foundModel = await MockModel.query().where('id', model.getId()).first();

            expect(response.status).toBe(HttpCodes.FORBIDDEN)
            expect(foundModel).toBeDefined()
        })
    })

    describe("show resource", () => {
        test("should be able to show a resource while authenticated", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20
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
                    age: number
                }
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.id).toBe(model.getId())
            expect(body.data.name).toBe(model.name)
            expect(body.data.age).toBe(model.age)
        })

        test("should not be able to show a resource while not being authenticated", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                }
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'GET',
                headers,
            })

            expect(response.status).toBe(HttpCodes.UNAUTHORIZED)
        })

        test("should be able to show a resource if it is owned by the user", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: user.getId(),
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
                ],
                security: [
                    router.security().resourceOwner('userId'),
                ],
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
                    age: number,
                    userId: string
                }
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.id).toBe(model.getId())
            expect(body.data.name).toBe(model.name)
            expect(body.data.age).toBe(model.age)
            expect(body.data.userId).toBe(user.getId())
        })

        test("should not be able to show a resource if it is not owned by the user", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: 'not-user-id',
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
                ],
                security: [
                    router.security().resourceOwner('userId'),
                ],
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'GET',
                headers,
            })
            
            expect(response.status).toBe(HttpCodes.FORBIDDEN)
        })
    })

    describe("index resource", () => {
        test("should be able to index a resource while authenticated", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
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
                ],
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
                    age: number
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(1)
            expect(body.data[0].id).toBe(model.getId())
            expect(body.data[0].name).toBe(model.name)
            expect(body.data[0].age).toBe(model.age)
        })

        test("should not be able to index a resource while not being authenticated", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'GET',
                headers,
            })

            expect(response.status).toBe(HttpCodes.UNAUTHORIZED)
        })

        test("should not be able to index a resource if it is not owned by the user", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: generateUuidV4()
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                security: [
                    router.security().resourceOwner('userId'),
                ],
                middlewares: [
                    MockAuthorizeMiddleware,
                ],
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
                    age: number
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(0)
        })

        test("should be able to index a resource if it is owned by the user", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: user.getId(),
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                security: [
                    router.security().resourceOwner('userId'),
                ],
                middlewares: [
                    MockAuthorizeMiddleware,
                ],
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
                    age: number,
                    userId: string
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(1)
            expect(body.data[0].id).toBe(model.getId())
            expect(body.data[0].name).toBe(model.name)
            expect(body.data[0].age).toBe(model.age)
            expect(body.data[0].userId).toBe(user.getId())
        })

        test("should be able to filter resources using exact match", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20,
                userId: user.getId(),
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
                ],
                security: [
                    router.security().resourceOwner('userId'),
                ],
                searching: {
                    fuzzy: false,
                    fields: ['name'],
                }
            })
            httpService.bindRoutes(router);

            const queryParams = '?filters[name]=Test';
            const response = await fetch(`http://localhost:${serverPort}/test${queryParams}`, {
                method: 'GET',
                headers,
            })
            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(1)
            expect(body.data[0].id).toBe(model.getId())
            expect(body.data[0].name).toBe(model.name)
            expect(body.data[0].age).toBe(model.age)
            expect(body.data[0].userId).toBe(user.getId())
        })

        test("should be able to fuzzy match filter", async () => {
            const model = await MockModel.create({
                name: 'John Doe',
                age: 20
            });
            const model2 = await MockModel.create({
                name: 'Jane Smith',
                age: 20
            });
            const model3 = await MockModel.create({
                name: 'John Smith',
                age: 20
            });
            await model.save();
            await model2.save();
            await model3.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ],
                searching: {
                    fuzzy: true,
                    fields: ['name'],
                }
            })
            httpService.bindRoutes(router);

            const queryParams = '?filters[name]=Jane';
            const response = await fetch(`http://localhost:${serverPort}/test${queryParams}`, {
                method: 'GET',
                headers,
            })
            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(1)
            expect(body.data[0].name).toBe(model2.name)

            const queryParams2 = '?filters[name]=Smith';
            const response2 = await fetch(`http://localhost:${serverPort}/test${queryParams2}`, {
                method: 'GET',
                headers,
            })
            const body2 = await response2.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response2.status).toBe(HttpCodes.OK)
            expect(body2.data.length).toBe(2)
            expect(body2.data[0].name).toBe(model2.name)
            expect(body2.data[1].name).toBe(model3.name)
        })

        test("should be able to paginate resources", async () => {
            const model = await MockModel.create({
                name: 'John Doe',
                age: 20
            });
            const model2 = await MockModel.create({
                name: 'Jane Smith',
                age: 20
            });
            await model.save();
            await model2.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ],
                paginate: {
                    pageSize: 1,
                }
            })
            httpService.bindRoutes(router);

            const queryParams = '?page=1';
            const response = await fetch(`http://localhost:${serverPort}/test${queryParams}`, {
                method: 'GET',
                headers,
            })
            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(1)
            expect(body.data[0].name).toBe(model.name)

            const queryParams2 = '?page=2';
            const response2 = await fetch(`http://localhost:${serverPort}/test${queryParams2}`, {
                method: 'GET',
                headers,
            })
            const body2 = await response2.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response2.status).toBe(HttpCodes.OK)
            expect(body2.data.length).toBe(1)
            expect(body2.data[0].name).toBe(model2.name)
        })

        test("should be able to override the page size", async () => {
            const model = await MockModel.create({
                name: 'John Doe',
                age: 20
            });
            const model2 = await MockModel.create({
                name: 'Jane Smith',
                age: 20
            });
            await model.save();
            await model2.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ],
                paginate: {
                    pageSize: 1,
                    allowPageSizeOverride: true,
                }
            })
            httpService.bindRoutes(router);

            const queryParams = '?page=1&pageSize=2';
            const response = await fetch(`http://localhost:${serverPort}/test${queryParams}`, {
                method: 'GET',
                headers,
            })
            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(2)
            expect(body.data[0].name).toBe(model.name)
            expect(body.data[1].name).toBe(model2.name)
        })

        test("should be able to sort resources", async () => {
            const model = await MockModel.create({
                name: 'Alice',
                age: 20
            });
            const model2 = await MockModel.create({
                name: 'Bob',
                age: 20
            });
            await model.save();
            await model2.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ],
                sorting: {
                    defaultField: 'name',
                    defaultDirection: 'asc',
                }
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
                    age: number,
                    userId: string
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(2)
            expect(body.data[0].name).toBe('Alice')
            expect(body.data[1].name).toBe('Bob')

            const queryParams = '?sort[name]=desc';
            const response2 = await fetch(`http://localhost:${serverPort}/test${queryParams}`, {
                method: 'GET',
                headers,
            })
            const body2 = await response2.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response2.status).toBe(HttpCodes.OK)
            expect(body2.data.length).toBe(2)
            expect(body2.data[0].name).toBe('Bob')
            expect(body2.data[1].name).toBe('Alice')
        })

        test('should be able to override the default field and direction', async () => {
            const model = await MockModel.create({
                name: 'Alice',
                age: 20
            });
            const model2 = await MockModel.create({
                name: 'Bob',
                age: 21
            });
            await model.save();
            await model2.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                middlewares: [
                    MockAuthorizeMiddleware,
                ],
                sorting: {
                    defaultField: 'name',
                    defaultDirection: 'asc',
                }
            })
            httpService.bindRoutes(router);

            const queryParams = '?sort[age]=asc';
            const response = await fetch(`http://localhost:${serverPort}/test${queryParams}`, {
                method: 'GET',
                headers,
            })
            const body = await response.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response.status).toBe(HttpCodes.OK)
            expect(body.data.length).toBe(2)
            expect(body.data[0].age).toBe(20)
            expect(body.data[1].age).toBe(21)

            const queryParams2 = '?sort[age]=desc';
            const response2 = await fetch(`http://localhost:${serverPort}/test${queryParams2}`, {
                method: 'GET',
                headers,
            })
            const body2 = await response2.json() as {
                data: {
                    id: string,
                    name: string,
                    age: number,
                    userId: string
                }[]
            }

            expect(response2.status).toBe(HttpCodes.OK)
            expect(body2.data.length).toBe(2)
            expect(body2.data[0].age).toBe(21)
            expect(body2.data[1].age).toBe(20)
        })
    })

    // describe("only resource", () => {
    //     test("should only be able to access the specified resource types", async () => {
    //         const router = new HttpRouter();
    //         router.resource({
    //             prefix: '/test',
    //             only: ['show'],
    //         })
    //     })
    // })

    describe("guest resource", () => {
        test("should allow multiple resource types to be accessible as a guest", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                allowUnauthenticated: true,
            })
            httpService.bindRoutes(router);

            const showResponse = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'GET',
                headers,
            })
            expect(showResponse.status).toBe(HttpCodes.OK)

            const deleteResponse = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'DELETE',
                headers,
            })
            expect(deleteResponse.status).toBe(HttpCodes.OK)
        })

        test("should only be able to access the specified resource types while as guest", async () => {
            const model = await MockModel.create({
                name: 'Test',
                age: 20
            });
            await model.save();

            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                },
                allowUnauthenticated: {
                    show: true,
                    delete: false,
                },
            })
            httpService.bindRoutes(router);

            const showResponse = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'GET',
                headers,
            })
            expect(showResponse.status).toBe(HttpCodes.OK)

            const deleteResponse = await fetch(`http://localhost:${serverPort}/test/${model.getId()}`, {
                method: 'DELETE',
                headers,
            })
            expect(deleteResponse.status).toBe(HttpCodes.UNAUTHORIZED)
        })
    })
});
