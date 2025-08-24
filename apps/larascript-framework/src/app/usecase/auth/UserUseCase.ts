
import { UnauthorizedException } from "@larascript-framework/larascript-auth";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";
import { IModel } from "@src/core/domains/models/interfaces/IModel";
import { auth } from "@src/core/services/AuthService";

/**
 * UserUseCase handles retrieving the authenticated user's profile
 * 
 * This class is responsible for:
 * - Validating that the user is authenticated via their JWT token
 * - Retrieving the user's data from the user repository
 * - Returning the user's profile data, excluding guarded attributes
 * 
 */
class UserUseCase {

    /**
     * Handle the user use case
     * @param context The HTTP context
     * @returns The API response
     */

    async handle(context: HttpContext): Promise<ApiResponse> {
        const userId = context.getUser()?.getId();

        if(!userId) {
            throw new UnauthorizedException();
        }

        const user = await auth().getUserRepository().findById(userId);

        if(!user) {
            throw new UnauthorizedException();
        }

        const userAttributes = await (user as unknown as IModel).toObject({ excludeGuarded: true });

        return new ApiResponse().setData(userAttributes);
    }

}


export default UserUseCase;


