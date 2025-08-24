import { TCastableType } from "@larascript-framework/larascript-utils";
import UserFactory from "@src/app/factory/UserFactory";
import AuthenticableUser, { AuthenticableUserAttributes } from "@src/app/models/auth/AuthenticableUser";
import UserObserver from "@src/app/observers/UserObserver";
import { IModelFactory } from "@src/core/interfaces/factory.t";

/**
 * User structure
 */
export interface UserAttributes extends AuthenticableUserAttributes {

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
export default class User extends AuthenticableUser {

    public static PASSWORD = 'password';

    public static FIRST_NAME = 'firstName';

    public static LAST_NAME = 'lastName';

    public static CREATED_AT = 'createdAt';

    public static UPDATED_AT = 'updatedAt';

    /**
     * Table name
     */

    public table: string = 'users';

    /**
     * @param data User data
     */
    constructor(data: UserAttributes | null = null) {
        super(data);
        this.setObserverConstructor(UserObserver);
    }
    
    protected casts?: Record<string, TCastableType> | undefined = {
        [User.ROLES]: 'array',
        [User.GROUPS]: 'array',
        [User.CREATED_AT]: 'date',
        [User.UPDATED_AT]: 'date',
    }

    /**
     * Guarded fields
     *
     * These fields cannot be set directly.
     */
    guarded: string[] = [
        User.HASHED_PASSWORD,
        User.PASSWORD,
        User.ROLES,
        User.GROUPS,
    ];

    /**
     * The fields that are allowed to be set directly
     *
     * These fields can be set directly on the model.
     */
    fields: string[] = [
        
        // fields required by AuthenticableUser
        User.EMAIL,
        User.HASHED_PASSWORD,
        User.ROLES,
        User.GROUPS,
        
        // fields required by User
        User.PASSWORD, // temporary field
        User.FIRST_NAME,
        User.LAST_NAME,
        User.CREATED_AT,
        User.UPDATED_AT,
    ]

    /**
     * Retrieves the fields defined on the model, minus the password field.
     * As this is a temporary field and shouldn't be saved to the database.
     * 
     * @returns The list of fields defined on the model.
     */
    getFields(): string[] {
        return super.getFields().filter(field => !['password'].includes(field));
    }

    /**
     * Retrieves the factory for the model.
     * 
     * @returns The factory for the model.
     */
    getFactory(): IModelFactory<User> {
        return new UserFactory();
    }

}
