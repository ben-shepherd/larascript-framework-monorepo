import { TDataSourceModelConstructor, TRouteResourceOptions } from "@larascript-framework/contracts/http";
import RouteConfigException from "../exceptions/RouteConfigException.js";
import Http from "../services/Http.js";

export class RouterResourceValidation {

    /**
     * Validate the resource options.
     * @param route - The route item.
     */
    static validate(resource: TRouteResourceOptions) {
        this.validateModelConstructorAndDatabaseConfigured(resource);
    }

    /**
     * Validate the model constructor and database configured.
     * - If the model constructor is provided and the database is not configured, throw an error.
     * 
     * @param resource - The resource options.
     */
    static validateModelConstructorAndDatabaseConfigured(resource: TRouteResourceOptions) {
        if((resource.datasource as TDataSourceModelConstructor)?.modelConstructor && !Http.getInstance().isDatabaseConfigured()) {
            throw new RouteConfigException('Database is not configured. Use a repository instead.');
        }
    }
}