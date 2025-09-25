import { IAccessControlEntity } from "@larascript-framework/larascript-acl";
import { IModelAttributes, Model } from "@larascript-framework/larascript-database";
import { IUserModel } from "../auth/index.js";

export interface AuthenticableUserModelAttributes extends IModelAttributes {
    id: string;
    email: string;
    hashedPassword: string;
    aclRoles: string[];
    aclGroups: string[];
}

/**
 * Represents an authenticable user in the system.
 * 
 * This class extends the base Model class and implements the IUserModel interface
 * to provide authentication and authorization capabilities for users. It manages
 * user attributes such as email, hashed password, roles, and groups, while
 * implementing security measures to protect sensitive data.
 * 
 * @extends Model<AuthenticableUserModelAttributes>
 * @implements IUserModel
 */
export class AuthenticableUserModel extends Model<AuthenticableUserModelAttributes> implements IUserModel, IAccessControlEntity {

    public static EMAIL = 'email';

    public static HASHED_PASSWORD = 'hashedPassword';

    public static PASSWORD = 'password';

    public static ACL_ROLES = 'aclRoles';

    public static ACL_GROUPS = 'aclGroups';

    constructor(data: AuthenticableUserModelAttributes | null = null) {
        super(data);
    }

    /**
     * Array of attribute names that should be protected from mass assignment
     */
    guarded: string[] = [
        'hashedPassword',
        'password',
        'aclRoles',
        'aclGroups',
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
        return this.getAttributeSync('aclRoles') ?? null;
    }

    /**
     * Sets the user's ACL roles
     * @param roles - Array of role names to set
     */
    async setAclRoles(roles: string[]): Promise<void> {
        await this.setAttribute('aclRoles', roles);
    }
    
    /**
     * Gets the user's ACL groups
     * @returns Array of group names or null if not set
     */
    getAclGroups(): string[] | null {
        return this.getAttributeSync('aclGroups') ?? null;
    }

    /**
     * Sets the user's ACL groups
     * @param groups - Array of group names to set
     */
    async setAclGroups(groups: string[]): Promise<void> {
        await this.setAttribute('aclGroups', groups);
    }

    /**
     * Checks if the user has a specific role or roles
     * @param role - Single role name or array of role names to check
     * @returns True if the user has the specified role(s), false otherwise
     */
    hasRole(role: string | string[]): boolean {
        const currentRoles = this.getAclRoles()
        if(!currentRoles) {
            return false
        }
        if(Array.isArray(role)) {
            return role.every(r => currentRoles.includes(r))
        }
        return currentRoles.includes(role)
    }

}

export default AuthenticableUserModel;