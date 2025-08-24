import { IAccessControlEntity } from "@larascript-framework/larascript-acl";
import { IUserModel } from "@larascript-framework/larascript-auth";
import { acl } from "@src/core/services/ACLService";
import Model from "../../../core/domains/models/base/Model";
import { IModelAttributes } from "../../../core/domains/models/interfaces/IModel";

export interface AuthenticableUserAttributes extends IModelAttributes {
    id: string;
    email: string;
    hashedPassword: string;
    roles: string[];
    groups: string[];
}

/**
 * Represents an authenticable user in the system.
 * 
 * This class extends the base Model class and implements the IUserModel interface
 * to provide authentication and authorization capabilities for users. It manages
 * user attributes such as email, hashed password, roles, and groups, while
 * implementing security measures to protect sensitive data.
 * 
 * @extends Model<AuthenticableUserAttributes>
 * @implements IUserModel
 */
class AuthenticableUser extends Model<AuthenticableUserAttributes> implements IUserModel, IAccessControlEntity {

    public static EMAIL = 'email';

    public static HASHED_PASSWORD = 'hashedPassword';

    public static PASSWORD = 'password';

    public static ROLES = 'roles';

    public static GROUPS = 'groups';

    constructor(data: AuthenticableUserAttributes | null = null) {
        super(data);
    }

    /**
     * Array of attribute names that should be protected from mass assignment
     */
    guarded: string[] = [
        'hashedPassword',
        'password',
        'roles',
        'groups',
    ];

    /**
     * Gets the user's unique identifier
     * @returns The user ID as a string
     */
    getId(): string {
        return this.getAttributeSync('id') ?? '';
    }

    /**
     * Gets the user's email address
     * @returns The email address or null if not set
     */
    getEmail(): string | null {
        return this.getAttributeSync('email') ?? null;
    }

    /**
     * Sets the user's email address
     * @param email - The email address to set
     */
    async setEmail(email: string): Promise<void> {
        await this.setAttribute('email', email);
    }

    /**
     * Gets the user's hashed password
     * @returns The hashed password or null if not set
     */
    getHashedPassword(): string | null {
        return this.getAttributeSync('hashedPassword') ?? null;
    }

    /**
     * Sets the user's hashed password
     * @param hashedPassword - The hashed password to set
     */
    async setHashedPassword(hashedPassword: string): Promise<void> {
        await this.setAttribute('hashedPassword', hashedPassword);
    }

    /**
     * Gets the user's ACL roles
     * @returns Array of role names or null if not set
     */
    getAclRoles(): string[] | null {
        return this.getAttributeSync('roles') ?? null;
    }

    /**
     * Sets the user's ACL roles
     * @param roles - Array of role names to set
     */
    async setAclRoles(roles: string[]): Promise<void> {
        await this.setAttribute('roles', roles);
    }
    
    /**
     * Gets the user's ACL groups
     * @returns Array of group names or null if not set
     */
    getAclGroups(): string[] | null {
        return this.getAttributeSync('groups') ?? null;
    }

    /**
     * Sets the user's ACL groups
     * @param groups - Array of group names to set
     */
    async setAclGroups(groups: string[]): Promise<void> {
        await this.setAttribute('groups', groups);
    }

    /**
     * Checks if the user has a specific role or roles
     * @param role - Single role name or array of role names to check
     * @returns True if the user has the specified role(s), false otherwise
     */
    hasRole(role: string | string[]): boolean {
        return acl().hasRole(this, role)
    }

}

export default AuthenticableUser;