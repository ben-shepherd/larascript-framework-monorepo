import httpConfig from "@/config/http.config.js";
import { app } from "@/core/services/App.js";
import { AppSingleton, BaseProvider } from '@larascript-framework/larascript-core';
import { IHttpServiceConfig } from "@larascript-framework/larascript-http";
import errorHandlers from "../http/middleware/errorHandlers.js";


export default class HttpErrorHandlerProvider extends BaseProvider {

    /**
     * The configuration for the Express provider
     *
     * @default httpConfig
     */
    protected config: IHttpServiceConfig = httpConfig;

    /**
     * Register method
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     *
     * @returns Promise<void>
     */
    public async register(): Promise<void> {
        this.log('Registering HttpErrorHandlerProvider');

        // Check if the routes provider has been registered
        if (!AppSingleton.safeContainer('routes.provided')) {
            throw new Error('HttpErrorHandlerProvider must be registered after RoutesProvider');
        }
    }

    /**
     * Boot the Express provider
     *
     * @returns Promise<void>
     */
    public async boot(): Promise<void> {

        /**
         * If Express is not enabled, return from the boot method
         */
        if (!this.config.enabled) {
            return;
        }

        /**
         * Get the Express instance from the container
         * Initialize Express
         */
        const http = app('http');

        // Handle errors
        http.getExpress().use(errorHandlers.notFoundHandler);
        http.getExpress().use(errorHandlers.errorHandler);

    }

}