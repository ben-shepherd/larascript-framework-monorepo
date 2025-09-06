import { AuthenticableUserModel, AuthenticableUserModelAttributes, IUserFactory } from "@larascript-framework/larascript-auth";
import { BaseModelFactory, ModelConstructor } from "@larascript-framework/larascript-database";

class AuthenticableUserFactory<T extends AuthenticableUserModel> extends BaseModelFactory<T> implements IUserFactory {

    constructor(modelConstructor: ModelConstructor<T>) {
        super(modelConstructor);
    }

    getDefinition(): AuthenticableUserModelAttributes {
        return {
            id: '',
            email: '',
            hashedPassword: '',
            roles: [],
            groups: []
        }
    }
}

export default AuthenticableUserFactory;