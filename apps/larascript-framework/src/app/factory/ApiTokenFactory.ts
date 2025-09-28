import { ApiTokenAttributes, ApiTokenFactory as BaseApiTokenFactory } from "@larascript-framework/larascript-auth";

class ApiTokenFactory extends BaseApiTokenFactory { 
    getDefinition(): ApiTokenAttributes {
        return {
            userId: '',
            token: '',
            scopes: [],
            options: {},
            expiresAt: new Date(),
            revokedAt: null,
        }
    }
}

export default ApiTokenFactory;