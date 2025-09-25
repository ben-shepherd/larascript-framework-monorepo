import { DatabaseResourceRepository } from "@/http/resources/repository/DatabaseResourceRepository.js";
import HttpRouter from "@/http/router/HttpRouter.js";
import { beforeEach, describe, test } from "@jest/globals";
import { IHttpService } from "@larascript-framework/contracts/http";
import { TestHttpEnvironment } from "./helpers/TestHttpEnvironment.js";
import { MockModel } from "./repository/MockModel.js";
import { resetMockModelTable } from "./repository/resetMockModelTable.js";

const headers = {
    "Content-Type": "application/json",
}

describe("resources test suite", () => {
    let httpService: IHttpService;
    let serverPort: number;

    beforeEach(async () => {
        await TestHttpEnvironment.create({
            withDatabase: true,
        }).boot();

        httpService = TestHttpEnvironment.getInstance().httpService;

        await resetMockModelTable();

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
        test("should be able to create a resource", async () => {
            const router = new HttpRouter();
            router.resource({
                prefix: '/test',
                datasource: {
                    modelConstructor: MockModel,
                }
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

        test("should fail if validation fails", async () => {
            
        })

        test("should add the owner's id to the resource", async () => {

        })
    });
});
