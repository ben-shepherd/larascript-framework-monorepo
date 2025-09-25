import HttpContext from "@/http/context/HttpContext.js";
import ResourceException from "@/http/exceptions/ResourceException.js";
import ApiResponse from "@/http/response/ApiResponse.js";
import { RouteResourceTypes } from "@/http/router/RouterResource.js";
import Paginate from "@/http/utils/Paginate.js";
import QueryFilters from "@/http/utils/QueryFilters.js";
import SortOptions from "@/http/utils/SortOptions.js";
import { IModelAttributes } from "@larascript-framework/contracts/database/model";
import { IPageOptions, ISortOption, TRouteItem } from "@larascript-framework/contracts/http";
import AbastractBaseResourceService from "../abstract/AbastractBaseResourceService.js";

/**
 * Service class that handles retrieving collections of resources through HTTP requests
 * 
 * This service:
 * - Validates authorization for viewing the resource collection
 * - Applies pagination and filtering options from the request
 * - Fetches filtered and paginated results
 * - Strips protected properties before returning
 * 
 * Used by ResourceController to handle GET requests for resource collections.
 * Provides standardized index/list functionality while enforcing security rules
 * and data protection.
 *
 * Key features:
 * - Pagination support via pageSize and skip parameters
 * - Filtering via query parameters
 * - Authorization checks
 * - Protected property stripping
 */

class ResourceIndexService extends AbastractBaseResourceService {

    routeResourceType: string = RouteResourceTypes.INDEX

    /**
     * Handles the resource all action
     * - Validates that the request is authorized
     * - If the resource owner security is enabled, adds the owner's id to the filters
     * - Fetches the results using the filters and page options
     * - Maps the results to models
     * - Strips the guarded properties from the results
     * - Sends the results back to the client
     * @param req The request object
     * @param res The response object
     * @param options The resource options
     */
    async handler(context: HttpContext): Promise<ApiResponse<IModelAttributes[]>> {

        // Get the route options
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        const repository = context.resourceContext.repository;
        
        // Build the page options, filters
        const pageOptions = this.buildPageOptions(context);
        const filters = this.getQueryFilters(context);
        const sortOptions = this.buildSortOptions(context);

            // Check if the resource owner security applies to this route and it is valid
        // If it is valid, we add the owner's id to the filters
        if(await this.validateResourceOwnerApplicable(context)) {
            const userId = context.getUserOrFail().getId()
            filters[repository.getResourceOwnerAttribute()] = userId
        }

        let resultDataArray = await repository.getResourcesPage(filters, pageOptions.page, pageOptions.pageSize ?? 10, sortOptions);

        // Strip the sensitive data
        resultDataArray = await Promise.all(resultDataArray.map(resultData => repository.stripSensitiveData(resultData)))

        // Send the results
        return this.apiResponse<IModelAttributes[]>(context, resultDataArray, 200, {
            showPagination: true
        })
    }

    /**
     * Builds the filters object by combining base filters defined in route options with
     * request filters from the query string. 
     * 
     * The base filters are defined in the route's
     * resource.filters.index configuration, while request filters come from the 'filters'
     * query parameter. 
     * 
     * The combined filters are processed to add SQL LIKE wildcards and
     * stripped of any fields that don't exist on the resource model.
     * 
     * @param {BaseRequest} req - The request object
     * @param {TRouteItem} options - The options object
     * @returns {object} - The filters object
     */
    getQueryFilters(context: HttpContext): object {
        const req = context.getRequest()
        const options = context.getRouteItem() as TRouteItem

        const baseFilters = options?.resource?.filters ?? {};
        const allowedFields = options?.resource?.searching?.fields ?? []
        const requestFilters = (new QueryFilters).parseRequest(req, { allowedFields: allowedFields }).getFilters();
        const filters = {
            ...baseFilters,
            ...requestFilters
        }

        // Build the filters with percent signs
        // Example: { title: 'foo' } becomes { title: '%foo%' }
        // Note: LIKE queries are not supported for now (they would  need to be implemented in the repository)
        // const filters = this.filtersWithPercentSigns({
        //     ...baseFilters,
        //     ...requestFilters
        // })

        // Strip the non-resource fields from the filters
        // Example: { title: 'foo', badProperty: '123' } becomes { title: 'foo' }
        return this.stripNonResourceFields(filters, allowedFields)
    }

    /**
     * Strips the non-resource fields from the filters
     * 
     * @param {object} filters - The filters object
     * @param {string[]} allowedFields - The allowed fields
     * @returns {object} - The stripped filters object
     */
    stripNonResourceFields(filters: object, allowedFields: string[]): object {
        return Object.keys(filters).filter(key => allowedFields.includes(key)).reduce((acc, key) => {
            acc[key] = filters[key];
            return acc;
        }, {});
    }

    /**
     * Returns a new object with the same key-value pairs as the given object, but
     * with an additional key-value pair for each key, where the key is wrapped in
     * percent signs (e.g. "foo" becomes "%foo%"). This is useful for building
     * filters in MongoDB queries.
     * @param {object} filters - The object to transform
     * @returns {object} - The transformed object
     */
    filtersWithPercentSigns(filters: object): object {
        return {
            ...filters,
            ...Object.keys(filters).reduce((acc, curr) => {
                const value = filters[curr];

                if(value === true || value === false) {
                    acc[curr] = value.toString();
                }
                else if(value === 'true' || value === 'false') {
                    acc[curr] = value;
                }
                else {
                    acc[curr] = `%${value}%`;
                }
                
                return acc;
            }, {})
        }
    }

    /**
     * Builds the page options
     * 
     * @param {BaseRequest} req - The request object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {IPageOptions} - An object containing the page number, page size, and skip
     */
    buildPageOptions(context: HttpContext): IPageOptions  {
        const req = context.getRequest()
        const options = context.getRouteItem() as TRouteItem

        const paginate = new Paginate().parseRequest(req, options.resource?.paginate);
        const page = paginate.getPage(1);
        const pageSize =  paginate.getPageSize() ?? options?.resource?.paginate?.pageSize;
        const skip = pageSize ? (page - 1) * pageSize : undefined;

        return { skip, page, pageSize };
    }

    /**
     * Builds the sort options
     * 
     * @param {BaseRequest} req - The request object
     * @returns {ISortOption[]} - The sort options
     */
    buildSortOptions(context: HttpContext): ISortOption[] {
        const sortOptions = SortOptions.parseRequest(
            context.getRequest(),
            context.resourceContext.options.sorting
        );

        return [{
            field: sortOptions.field,
            sortDirection: sortOptions.sortDirection
        }];
    }

}

export default ResourceIndexService;