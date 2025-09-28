import { IAuthenticableUserModel } from "@larascript-framework/contracts/auth";
import { ModelConstructor } from "@larascript-framework/larascript-database";
import User from "../models/User.js";
import AuthenticableUserFactory from "./AuthenticableUserFactory.js";

export class UserFactory extends AuthenticableUserFactory {

    constructor(user: ModelConstructor<IAuthenticableUserModel> = User as ModelConstructor<IAuthenticableUserModel>) {
        super(user);
    }

    getDefinition(): NonNullable<User['attributes']> {
        return {
            // Include AuthenticableUser attributes
            ...super.getDefinition(),
            [User.FIRST_NAME]: '',
            [User.LAST_NAME]: '',
            [User.CREATED_AT]: new Date(),
            [User.UPDATED_AT]: new Date(),
            
        } as NonNullable<User['attributes']>;
    }

    testDefinition(): NonNullable<User['attributes']> {
        return {
            ...this.getDefinition(),
            [User.FIRST_NAME]: this.faker.person.firstName(),
            [User.LAST_NAME]: this.faker.person.lastName(),
            [User.EMAIL]: this.faker.internet.email(),
            [User.CREATED_AT]: new Date(),
            [User.UPDATED_AT]: new Date(),
        } as NonNullable<User['attributes']>;
    }

}

export default UserFactory;
