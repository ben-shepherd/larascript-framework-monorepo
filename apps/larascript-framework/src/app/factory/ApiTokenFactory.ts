import BaseModelFactory from "@src/core/base/BaseModelFactory";
import ApiToken, { ApiTokenAttributes } from "../models/auth/ApiToken";

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