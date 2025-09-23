import HttpContext from "@/http/context/HttpContext.js";
import ResourceException from "@/http/exceptions/ResourceException.js";
import { UnauthorizedException } from "@/http/exceptions/UnauthorizedException.js";
import ApiResponse from "@/http/response/ApiResponse.js";
import { RouteResourceTypes } from "@/http/router/RouterResource.js";
import Http from "@/http/services/Http.js";
import stripGuardedResourceProperties from "@/http/utils/stripGuardedResourceProperties.js";
import { IModelAttributes } from "@larascript-framework/contracts/database/model";
import { TResponseErrorMessages } from "@larascript-framework/contracts/http";
import { ForbiddenResourceError } from "../../exceptions/ForbiddenResourceError.js";
import AbastractBaseResourceService from "../abstract/AbastractBaseResourceService.js";

/**
 * Service class that handles updating existing resources through HTTP requests
 * 
 * This service:
 * - Validates authorization for the update action
 * - Fetches the existing resource by ID
 * - Validates resource ownership if enabled
 * - Updates the resource with request data
 * - Strips protected properties before returning
 * 
 * Used by ResourceController to handle PUT/PATCH requests to update resources.
 * Provides standardized update functionality while enforcing security rules
 * and data protection.
 */
class ResourceUpdateService extends AbastractBaseResourceService {

    routeResourceType: string = RouteResourceTypes.UPDATE

    /**
     * Handles the resource delete action
     * - Validates that the request is authorized
     * - Checks if the resource owner security applies to this route and it is valid
     * - Deletes the resource
     * - Sends the results back to the client
     * @param {BaseRequest} req - The request object
     * @param {Response} res - The response object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {Promise<void>}
     */
    async handler(context: HttpContext): Promise<ApiResponse<IModelAttributes | TResponseErrorMessages>> {

        // Check if the authorization security applies to this route and it is valid
        if (!await this.validateAuthorized()) {
            throw new UnauthorizedException()
        }

        const routeOptions = context.getRouteItem()

        if (!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        // Validate the request body
        const validationErrors = await this.getValidationErrors(context)

        if (validationErrors) {
            return this.apiResponse(context, {
                errors: validationErrors
            }, 422)
        }

        const modelConstructor = this.getModelConstructor(context)

        // Normalize the primary key if required
        const primaryKey = this.getPrimaryKey(modelConstructor)

        const builder = Http.getInstance().getQueryBuilderService().builder(modelConstructor)
            .where(primaryKey, context.getRequest().params?.id)


        const result = await builder.firstOrFail()

        // Check if the resource owner security applies to this route and it is valid
        if (!await this.validateResourceAccess(context, result)) {
            throw new ForbiddenResourceError()
        }

        await result.fill(context.getRequest().body);
        await result.save();

        // Send the results
        return this.apiResponse<IModelAttributes>(context, (await stripGuardedResourceProperties(result))[0], 200)

    }


}

export default ResourceUpdateService;