import HttpContext from "@/http/context/HttpContext.js";
import ResourceException from "@/http/exceptions/ResourceException.js";
import ApiResponse from "@/http/response/ApiResponse.js";
import { RouteResourceTypes } from "@/http/router/RouterResource.js";
import Http from "@/http/services/Http.js";
import { IModelAttributes } from "@larascript-framework/contracts/database/model";
import { ForbiddenResourceError } from "../../exceptions/ForbiddenResourceError.js";
import stripGuardedResourceProperties from "../../utils/stripGuardedResourceProperties.js";
import AbastractBaseResourceService from "../abstract/AbastractBaseResourceService.js";

/**
 * Service class that handles retrieving individual resources through HTTP requests
 * 
 * This service:
 * - Validates authorization for viewing the resource
 * - Fetches a single resource by ID
 * - Validates resource ownership if enabled
 * - Strips protected properties before returning
 * 
 * Used by ResourceController to handle GET requests for individual resources.
 * Provides standardized show/view functionality while enforcing security rules
 * and data protection.
 */

class ResourceShowService extends AbastractBaseResourceService {

    routeResourceType: string = RouteResourceTypes.SHOW

    /**
     * Handles the resource show action
     * - Validates that the request is authorized
     * - If the resource owner security is enabled, adds the owner's id to the filters
     * - Fetches the result using the filters
     * - Maps the result to a model
     * - Strips the guarded properties from the result
     * - Sends the result back to the client
     * @param req The request object
     * @param res The response object
     * @param options The resource options
     */
    async handler(context: HttpContext): Promise<ApiResponse<IModelAttributes>> {

        const routeOptions = context.getRouteItem()

        if (!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        const id = context.getRequest().params?.id

        if (!this.validateId(id)) {
            return this.apiResponse<IModelAttributes>(context, {
                message: 'Resource not found'
            }, 404)
        }

        const modelConstructor = this.getModelConstructor(context)

        // Query builder
        const builder = Http.getInstance().getQueryBuilderService().builder(modelConstructor)
            .limit(1)

        // Normalize the primary key if required
        const primaryKey = this.getPrimaryKey(modelConstructor)

        // Attach the id to the query
        builder.where(primaryKey, context.getRequest().params?.id)

        // Fetch the results
        const result = await builder.firstOrFail()

        // Check if the resource owner security applies to this route and it is valid
        if (!await this.validateResourceAccess(context, result)) {
            throw new ForbiddenResourceError()
        }

        // Send the results
        return this.apiResponse<IModelAttributes>(context, (await stripGuardedResourceProperties(result))[0], 200)
    }

    /**
     * Validates the id
     * @param id The id to validate
     * @returns True if the id is valid, false otherwise
     */
    protected validateId(id: string): boolean {
        return typeof id === 'string' && id !== 'null';
    }

}

export default ResourceShowService;