import { IHttpServiceConfig } from "@larascript-framework/contracts/http";

export const testConfig: IHttpServiceConfig = {
    enabled: true,
    port: 0, // Use dynamic port allocation
    beforeAllMiddlewares: [],
    afterAllMiddlewares: [],
    extendExpress: () => {}
}