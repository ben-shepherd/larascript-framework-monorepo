import { AuthenticableUserModel, AuthenticableUserModelAttributes } from "@larascript-framework/larascript-auth";
import { IUserFactory } from "@larascript-framework/larascript-auth/dist/auth/interfaces/factory";
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