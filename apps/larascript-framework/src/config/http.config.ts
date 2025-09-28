import { IHttpServiceConfig } from "@larascript-framework/contracts/http";
import { parseBooleanFromString } from '@larascript-framework/larascript-utils';

const config: IHttpServiceConfig = {

    /**
     * Enable Express
     */
    enabled: parseBooleanFromString(process.env.ENABLE_EXPRESS, 'true'),

    /**
     * HTTP port
     */
    port: parseInt(process.env.APP_PORT ?? '5000'),

    /**
     * Global middleware to run before every other middleware
     */
    beforeAllMiddlewares: [

    ],

    /**
     * Global middleware to run after every other middleware
     */
    afterAllMiddlewares: [
        
    ],

    /**
     * Extend the express app
     */
    extendExpress: (app) => {

    },

    /**
     * CSRF protection
     */
    csrf: {
        methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
        headerName: 'x-xsrf-token',
        ttl: 24 * 60 * 60,

        /**
         * Exclude routes from CSRF protection
         * You may use '*' to exclude all routes e.g. '/auth/*'
         */
        exclude: [
            // Exclude all routes
            // '/*',

            // Exclude specific routes
            '/auth/login',
            '/auth/register',
            '/auth/logout',
            '/auth/refresh',
        ]
    },

};

export default config