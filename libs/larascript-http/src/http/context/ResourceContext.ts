import { IResourceRepository, TDataSourceRepository } from "@larascript-framework/contracts/http";
import RouteConfigException from "../exceptions/RouteConfigException.js";
import HttpContext from "./HttpContext.js";

export class ResourceContext {

    constructor(private readonly context: HttpContext) {}

    /**
     * Gets the repository of the resource.
     * @returns {IResourceRepository} The repository of the resource.
     */
    get repository(): IResourceRepository {
        const repository = (this.context.getRouteItem()?.resource?.datasource as TDataSourceRepository).repository

        if(!repository) {
            throw new RouteConfigException('Repository is not set')
        }

        return repository
    }
}