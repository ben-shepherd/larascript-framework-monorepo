import AuthenticableUserModel from "@/auth/models/AuthenticableUserModel.js";
import { AuthenticableUserModelAttributes, IAuthenticableUserModel, IUserFactory } from "@larascript-framework/contracts/auth";
import { BaseModelFactory, ModelConstructor } from "@larascript-framework/larascript-database";

export class AuthenticableUserFactory<T extends IAuthenticableUserModel = IAuthenticableUserModel> extends BaseModelFactory<T> implements IUserFactory {

    constructor(modelConstructor: ModelConstructor<T>) {
        super(modelConstructor);
    }

    getDefinition(): AuthenticableUserModelAttributes {
        return {
            [AuthenticableUserModel.ID]: '',
            [AuthenticableUserModel.EMAIL]: '',
            [AuthenticableUserModel.HASHED_PASSWORD]: '',
            [AuthenticableUserModel.ACL_ROLES]: [],
            [AuthenticableUserModel.ACL_GROUPS]: []
        } as AuthenticableUserModelAttributes;
    }
}

export default AuthenticableUserFactory;