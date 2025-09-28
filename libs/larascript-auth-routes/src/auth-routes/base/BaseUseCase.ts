import { AuthEnvironment, IHttpAuthRoutesConfig } from "@larascript-framework/larascript-auth";
import { ApiResponse, HttpContext } from "@larascript-framework/larascript-http";
import { AuthRoutesService } from "../services/AuthRoutesService.js";

export abstract class BaseUseCase {

    abstract handle(context: HttpContext): Promise<ApiResponse>;

    get environment(): AuthEnvironment {
        return AuthEnvironment.getInstance();
    }

    get config(): IHttpAuthRoutesConfig {
        return AuthRoutesService.getInstance().getConfig()!;
    }
}