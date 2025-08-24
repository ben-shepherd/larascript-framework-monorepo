import { IApiTokenAttributes, IApiTokenModel } from "@larascript-framework/larascript-auth";
import { BaseFactory } from "@larascript-framework/larascript-core";

class ApiTokenFactory extends BaseFactory<IApiTokenModel> {

    getDefinition(): IApiTokenAttributes {
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