import { beforeEach, describe } from "@jest/globals";
import { IHttpService } from "@larascript-framework/contracts/http";
import { HttpEnvironment } from "../http/environment/HttpEnvironment.js";
import { TestHttpEnvironment } from "./helpers/TestHttpEnvironment.js";

const headers = {
    "Content-Type": "application/json",
}

describe("resources create test suite", () => {
    let httpService: IHttpService;
    let serverPort: number;
    
    beforeEach(async () => {
        await TestHttpEnvironment.create().boot();
        httpService = HttpEnvironment.getInstance().httpService;

        serverPort = httpService.getPort()!;
    });

    describe("error handlers", () => {
        test("should return a 404 error when a route is not found", async () => {
            const response = await fetch(`http://localhost:${serverPort}/not-found`, {
                method: 'GET',
                headers: headers,
            });
            const body = await response.json() as { error: string };

            expect(response.status).toBe(404);
            expect(body.error).toBe('Invalid route');
        })
    });
});
