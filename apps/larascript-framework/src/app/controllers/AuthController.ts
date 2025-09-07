import LoginUseCase from "@/app/usecase/auth/LoginUseCase.js";
import LogoutUseCase from "@/app/usecase/auth/LogoutUseCase.js";
import RefreshUseCase from "@/app/usecase/auth/RefreshUseCase.js";
import RegisterUseCase from "@/app/usecase/auth/RegisterUseCase.js";
import UpdateUseCase from "@/app/usecase/auth/UpdateUseCase.js";
import UserUseCase from "@/app/usecase/auth/UserUseCase.js";
import Controller from "@/core/domains/http/base/Controller.js";
import HttpContext from "@/core/domains/http/context/HttpContext.js";
import { ForbiddenResourceError } from "@/core/domains/http/exceptions/ForbiddenResourceError.js";
import responseError from "@/core/domains/http/handlers/responseError.js";
import ApiResponse from "@/core/domains/http/response/ApiResponse.js";
import { UnauthorizedException } from "@larascript-framework/larascript-auth";
import { ValidatorException } from "@larascript-framework/larascript-validator";

/**
 * Controller handling authentication-related HTTP endpoints.
 * 
 * This controller manages user authentication operations including:
 * - User registration
 * - Login/authentication
 * - User profile retrieval
 * - Logout
 * - Token refresh
 * 
 * Each method handles its respective HTTP endpoint and delegates the business logic
 * to appropriate use cases while handling response formatting and error cases.
 */
class AuthController extends Controller {

    protected loginUseCase = new LoginUseCase();
    
    protected registerUseCase = new RegisterUseCase();

    protected userUseCase = new UserUseCase();
    
    protected logoutUseCase = new LogoutUseCase();

    protected refreshUseCase = new RefreshUseCase();

    protected updateUseCase = new UpdateUseCase();

    /**
     * Handle the login endpoint

     * @param context The HTTP context
     * @returns The API response
     */
    async login(context: HttpContext) {
        this.handler(context, async () => {
            return await this.loginUseCase.handle(context)
        })
    }


    /**
     * Handle the register endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async register(context: HttpContext) {
        this.handler(context, async () => {
            return await this.registerUseCase.handle(context)
        })
    }

    /**
     * Handle the user endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async user(context: HttpContext) {
        this.handler(context, async () => {
            return await this.userUseCase.handle(context)
        })
    }


    /**
     * Handle the logout endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async logout(context: HttpContext) {
        this.handler(context, async () => {
            return await this.logoutUseCase.handle(context)
        })
    }

    /**
     * Handle the refresh endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async refresh(context: HttpContext) {
        this.handler(context, async () => {
            return await this.refreshUseCase.handle(context)
        })
    }

    /**
     * Handle the update endpoint
     * @param context The HTTP context
     * @returns The API response
     */
    async update(context: HttpContext) {
        this.handler(context, async () => {
            return await this.updateUseCase.handle(context)
        })
    }

    /**
     * Handle the request
     * @param context The HTTP context
     * @param callback The callback to handle the request
     * @returns The API response

     */
    protected async handler(context: HttpContext, callback: () => Promise<ApiResponse>) {
        try {
            const apiResponse = await callback();

            return this.jsonResponse(
                apiResponse.toResponseObject(),
                apiResponse.getCode()
            )
        }
        catch (error) {
            if(error instanceof UnauthorizedException) {
                responseError(context.getRequest(), context.getResponse(), error as Error, 401)
                return;
            }

            if(error instanceof ValidatorException) {
                responseError(context.getRequest(), context.getResponse(), error as Error, 422)
                return;
            }

            if(error instanceof ForbiddenResourceError) {
                responseError(context.getRequest(), context.getResponse(), error as Error, 403)
                return;
            }

            responseError(context.getRequest(), context.getResponse(), error as Error)
        }

    }

}

export default AuthController;
