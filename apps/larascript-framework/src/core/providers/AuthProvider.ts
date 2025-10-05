

import { aclConfig } from "@/config/acl.config.js";
import { authConfig } from "@/config/auth.config.js";
import GenerateJwtSecret from "@/core/commands/GenerateJwtSecret.js";
import { app } from "@/core/services/App.js";
import { IAclConfig } from "@larascript-framework/larascript-acl";
import { AuthEnvironment, IHttpAuthRoutesConfig } from "@larascript-framework/larascript-auth";
import { AuthRoutesService } from "@larascript-framework/larascript-auth-routes";
import { AppSingleton, BaseProvider, EnvironmentType } from "@larascript-framework/larascript-core";

class AuthProvider extends BaseProvider {

    protected config: IHttpAuthRoutesConfig = authConfig

    protected aclConfig: IAclConfig = aclConfig

    async register() {

        await AuthEnvironment.create({
            environment: AppSingleton.env() as EnvironmentType,
            authConfig: this.config,
            aclConfig: this.aclConfig,
            secretKey: this.config.drivers.jwt.options.secret,
        });

        // Register auth routes
        AuthRoutesService.create(this.config)

        // Register commands
        app('console').register(GenerateJwtSecret)
    }

    async boot() {
        await AuthEnvironment.getInstance().boot();
    }
}

export default AuthProvider;

