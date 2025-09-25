import ApiToken, { ApiTokenAttributes } from "@/models/ApiToken.js";
import { BaseModelFactory } from "@larascript-framework/larascript-database";

class ApiTokenFactory extends BaseModelFactory<ApiToken> {

    constructor() {
        super(ApiToken);
    }

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