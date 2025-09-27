import HttpRouter from "@/http/router/HttpRouter.js";
import Http from "@/http/services/Http.js";
import { beforeEach, describe, test } from "@jest/globals";
import { IUserModel } from "@larascript-framework/contracts/auth";
import { IHttpAuthService, IHttpService, IResourceRepository, MiddlewareConstructor } from "@larascript-framework/contracts/http";
import { TestHttpEnvironment } from "./TestHttpEnvironment.js";

describe("config optional database test suite", () => {
    let mockAuthorizeMiddleware: MiddlewareConstructor;
    let httpService: IHttpService;
    const mockCustomRepository: IResourceRepository = {} as unknown as IResourceRepository;
    
    beforeEach(async () => {
        await TestHttpEnvironment.create({
            withDatabase: false,
        }).boot();

        httpService = TestHttpEnvironment.getInstance().httpService;

        mockAuthorizeMiddleware = TestHttpEnvironment.getInstance().createMockAuthorizeUserMiddleware({} as IUserModel);
    });

    describe("optional auth dependencies", () => {
        test("should get an error if a authorize middleware is provided but the auth dependencies are not configured", async () => {
            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    repository: mockCustomRepository,
                },
                middlewares: [mockAuthorizeMiddleware],
            })
            
            expect(() => httpService.bindRoutes(router)).toThrow('Auth service not configured');
        })

        test("should not get an error if a authorize middleware is provided and the auth dependencies are configured", async () => {
            const router = new HttpRouter();

            Http.getInstance().setPartialDependencies({
                authService: {} as unknown as IHttpAuthService,
            });

            expect(() =>
                router.resource({
                    prefix: '/test',
                    datasource: {
                        repository: mockCustomRepository,
                    },
                    middlewares: [mockAuthorizeMiddleware],
                })
            ).not.toThrow();
        })
    })
});
