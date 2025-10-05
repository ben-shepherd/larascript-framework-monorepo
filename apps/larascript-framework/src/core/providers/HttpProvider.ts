import httpConfig from "@/config/http.config.js";
import { routesConfig } from "@/config/routes.config.js";
import { IHttpServiceConfig, IRouter } from "@larascript-framework/contracts/http";
import { BaseProvider } from '@larascript-framework/larascript-core';
import { HttpEnvironment, HttpService } from "@larascript-framework/larascript-http";
import expressLayouts from 'express-ejs-layouts';
import path from 'path';

export default class HttpProvider extends BaseProvider {

    private httpService!: HttpService;

    private routesConfig: () => IRouter[] = routesConfig;

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
        this.log('Registering HttpProvider');


        const httpService = new HttpService(this.config);

        /**
         * Setup view engine, views, layouts directories
         */
        httpService.getExpress().set('view engine', 'ejs')
        httpService.getExpress().set('views', path.join(process.cwd(), 'src', 'app', 'resources', 'views'))
        httpService.getExpress().use(expressLayouts);
        httpService.getExpress().set('layout', path.join(process.cwd(), 'src', 'app', 'resources', 'layouts', 'base-view.ejs'));

        /**
         * Setup routes
         */
        for(const route of this.routesConfig()) {
            httpService.useRouter(route);
        }

        HttpEnvironment.create(httpService)
        HttpEnvironment.getInstance().httpService = httpService;

        this.bind('http', HttpEnvironment.getInstance().httpService);
    }

    /**
     * Boot the Express provider
     *
     * @returns Promise<void>   
     */
    public async boot(): Promise<void> {

        await HttpEnvironment.create(this.httpService).boot();

        // Log that Express is successfully listening
        this.log('Express successfully listening on port ' + this.httpService.getConfig()?.port);
    }


}