

import { IAclConfig } from "@larascript-framework/larascript-acl";
import { AuthService } from "@larascript-framework/larascript-auth";
import { BaseProvider } from "@larascript-framework/larascript-core";
import { aclConfig } from "@src/config/acl.config";
import { authConfig, IExtendedAuthConfig } from "@src/config/auth.config";
import GenerateJwtSecret from "@src/core/commands/GenerateJwtSecret";
import { app } from "@src/core/services/App";

class AuthProvider extends BaseProvider {

    protected config: IExtendedAuthConfig = authConfig

    protected aclConfig: IAclConfig = aclConfig

    async register() {

        if(typeof app('asyncSession') === 'undefined'){
            throw new Error('asyncSession service is not ready');
        }

        // Important: 
        // It's important to use the shared asyncSession service bound to the app container
        // because it will be used by the auth service and other services that need to access the session
        // If you don't do this, the auth service will not be able to access the session
        const authService = new AuthService(this.config, this.aclConfig, app('asyncSession'))
        await authService.boot();
        
        // Bind services
        this.bind('auth', authService);
        this.bind('auth.jwt', (() => authService.getJwt())())

        // Register commands
        app('console').register(GenerateJwtSecret)
    }


}

export default AuthProvider;

