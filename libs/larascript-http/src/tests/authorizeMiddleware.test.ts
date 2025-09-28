import Controller from "@/http/base/Controller.js";
import HttpContext from "@/http/context/HttpContext.js";
import AuthorizeMiddleware from "@/http/middleware/AuthorizeMiddleware.js";
import HttpRouter from "@/http/router/HttpRouter.js";
import { beforeEach, describe } from "@jest/globals";
import { IApiTokenModel, IUserModel } from "@larascript-framework/contracts/auth";
import { IHttpService, MiddlewareConstructor } from "@larascript-framework/contracts/http";
import { TestHttpEnvironment } from "./helpers/TestHttpEnvironment.js";
import { resetMockModelTable } from "./repository/resetMockModelTable.js";

const headers = {
    "Content-Type": "application/json",
}

describe("authorize middleware test suite", () => {
    let httpService: IHttpService;
    let serverPort: number;
    let user: IUserModel;
    let jwt: string;
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
        jwt = await TestHttpEnvironment.getInstance().getAuthTestEnvironment().createJwtFromUser(user, [], {
            expiresAfterMinutes: 60 * 24, // 24 hours
        });

        serverPort = httpService.getPort()!;
    });

    describe("authorize middleware", () => {
        test("should be able to attempt authenticate token", async () => {
            const apiToken = await TestHttpEnvironment.getInstance().getAuthTestEnvironment().authService.getJwt().attemptAuthenticateToken(jwt);

            expect(apiToken).toBeDefined();
            expect(apiToken?.getUserId()).toBe(user.getId());
            expect(apiToken?.getScopes()).toEqual([]);
            expect(apiToken?.getOptions()).toEqual({
                expiresAfterMinutes: 60 * 24, // 24 hours
            });
        })

        test("should be able to authorize a user", async () => {
            const headers = {
                'Authorization': `Bearer ${jwt}`,
            }
            const controller = class extends Controller {
                async invoke(context: HttpContext) {
                    return this.jsonResponse({
                        message: 'Hello, world!',
                    })
                }
            }

            const router = new HttpRouter();
            router.get('/test', controller, {
                middlewares: [
                    AuthorizeMiddleware
                ],
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'GET',
                headers,
            })
            const body = await response.json() as { message: string };

            expect(response.status).toBe(200)
            expect(body).toEqual({
                message: 'Hello, world!',
            })
        })

        test("should not be able to authorize a user with a revoked token", async () => {
            const apiToken = await TestHttpEnvironment.getInstance().getAuthTestEnvironment().authService.getJwt().attemptAuthenticateToken(jwt);
            expect(apiToken).toBeDefined();
            await TestHttpEnvironment.getInstance().getAuthTestEnvironment().authService.getJwt().revokeToken(apiToken as IApiTokenModel);

            const controller = class extends Controller {
                async invoke(context: HttpContext) {
                    return this.jsonResponse({
                        message: 'Hello, world!',
                    })
                }
            }

            const router = new HttpRouter();
            router.get('/test', controller, {
                middlewares: [
                    AuthorizeMiddleware
                ],
            })
            httpService.bindRoutes(router);

            const response = await fetch(`http://localhost:${serverPort}/test`, {
                method: 'GET',
                headers,
            })

            expect(response.status).toBe(401)
        })
    });
});
