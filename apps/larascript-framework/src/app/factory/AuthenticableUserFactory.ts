import { IUserFactory } from "@larascript-framework/larascript-auth/dist/auth/interfaces/factory";
import BaseModelFactory from "@src/core/base/BaseModelFactory";
import { ModelConstructor } from "@src/core/domains/models/interfaces/IModel";
import AuthenticableUser, { AuthenticableUserAttributes } from "../models/auth/AuthenticableUser";

class AuthenticableUserFactory<T extends AuthenticableUser> extends BaseModelFactory<T> implements IUserFactory {

    constructor(modelConstructor: ModelConstructor<T>) {
        super(modelConstructor);
    }

    getDefinition(): AuthenticableUserAttributes {
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