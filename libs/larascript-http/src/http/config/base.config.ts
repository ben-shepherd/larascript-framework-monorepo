import { IHttpConfig } from '@larascript-framework/contracts/http';
import cors from 'cors';
import expressBusboy from 'express-busboy';
import path from 'path';

export const baseConfig: IHttpConfig = {
    enabled: true,
    port: 5000,
    beforeAllMiddlewares: [
        cors()
    ],
    afterAllMiddlewares: [],
    extendExpress: (app) => {
        expressBusboy.extend(app, {
            upload: true,
            path: path.join(process.cwd(), 'storage', 'tmp'),
            allowedPath: /./
        })
    },
    csrf: {},
    logging: {},
}