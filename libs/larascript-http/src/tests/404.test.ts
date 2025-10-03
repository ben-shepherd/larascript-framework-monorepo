import { describe } from "@jest/globals";
import { HttpEnvironment } from "../http/environment/HttpEnvironment.js";
import { TestHttpEnvironment } from "./helpers/TestHttpEnvironment.js";

const headers = {
    "Content-Type": "application/json",
}

describe("resources create test suite", () => {
    let serverPort: number;

    describe("error handlers", () => {
        test("should return a 404 error when a route is not found", async () => {
            await TestHttpEnvironment.create().boot();
            serverPort = HttpEnvironment.getInstance().httpService.getPort()!;

            const response = await fetch(`http://localhost:${serverPort}/not-found`, {
                method: 'GET',
                headers: headers,
            });
            const body = await response.json() as { error: string };

            expect(response.status).toBe(404);
            expect(body.error).toBe('Invalid route');
        })

        test("should return a customized 404 error when configured", async () => {
            await TestHttpEnvironment.create()
            .withHttpServiceConfig({
                errorHandlers: {
                    notFoundHandler: (req, res, next) => {
                        res.status(404).send({ error: 'Custom 404 error' });
                    },
                },
            })
            .boot();
            serverPort = HttpEnvironment.getInstance().httpService.getPort()!;

            const response = await fetch(`http://localhost:${serverPort}/not-found`, {
                method: 'GET',
                headers: headers,
            });
            const body = await response.json() as { error: string };

            expect(response.status).toBe(404);
            expect(body.error).toBe('Custom 404 error');
        })
    });
});
