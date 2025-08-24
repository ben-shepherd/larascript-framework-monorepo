import { BaseFactory } from "@larascript-framework/larascript-core";
import AuthenticableUser, { AuthenticableUserAttributes } from "../models/auth/AuthenticableUser";

class AuthenticableUserFactory<T extends AuthenticableUser> extends BaseFactory<T> {
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