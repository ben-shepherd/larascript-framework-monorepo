import { AuthenticableUserModel, AuthenticableUserModelAttributes } from "@larascript-framework/larascript-auth";
import { IModelEvents } from "@larascript-framework/larascript-database";
import { UserAttributes } from "@src/app/models/auth/User";
import TestUserCreatedListener from "../../events/TestUserCreatedListener";


export interface TestUserAttributes extends AuthenticableUserModelAttributes {

    // AuthenticableUser attributes
    id: string;
    email: string;
    hashedPassword: string;
    roles: string[];
    groups: string[];

    // Additional fields
    password?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * User model
 *
 * Represents a user in the database.
 */
export default class TestUser extends AuthenticableUserModel {

    public table: string = 'users';

    constructor(data: UserAttributes | null = null) {
        super(data);
    }

    protected events?: IModelEvents | undefined = {
        created: TestUserCreatedListener
    }

}
 