import HttpRouter from "@/http/router/HttpRouter.js";
import HttpService from "@/http/services/HttpService.js";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { Request, Response } from "express";

describe("httpService test suite", () => {
    let httpService: HttpService;

    beforeEach(() => {
        if(httpService) {
            httpService.close()
        }
        
        httpService = new HttpService({
            enabled: true,
            port: 3000, 
        });
        // TODO: We need to get these services. Possibly from a shared package that boots the app?
        // Http.init({
        //     environment: EnvironmentTesting,
        //     httpConfig: {
        //         enabled: true,
        //         port: 3000, 
        //     },
        //     storage: new StorageService({}),
        //     requestContext: new RequestContext(),
        //     logger: new LoggerService(),
        //     asyncSession: new AsyncSessionService(),
        //     authService: new AuthService(),
        //     databaseService: new DatabaseService(),
        //     queryBuilderService: new QueryBuilderService(),
        // });
        httpService.init()
    });

    describe("listen", () => {
        test("should be able to listen", async () => {
            await expect(() => httpService.listen()).not.toThrow();

            expect(httpService.getServer()).not.toBeNull();
        })
    });

    describe("routes", () => {
        test("should be able to bind routes using express functions", async () => {

            const router = new HttpRouter();
            router.get('/test', (req: Request, res: Response) => {
                res.send('test');
            });

            httpService.bindRoutes(router);
            await httpService.listen();

            const response = await fetch('http://localhost:3000/test', {
                method: 'GET',
            });
            expect(response.status).toBe(200);
            expect(response.body).toBe('test');
            expect(httpService.getRegisteredRoutes()).not.toBeNull();
        })
    })
});
