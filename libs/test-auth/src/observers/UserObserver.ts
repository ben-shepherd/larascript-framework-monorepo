import { UserAttributes } from "@/models/User.js";
import { TestAuthEnvironment } from "@/test-auth/TestAuthEnvironment.js";
import { AuthenticableUserModel } from "@larascript-framework/larascript-auth";
import { Observer } from "@larascript-framework/larascript-observer";

/**
 * Observer for the User model.
 * 
 * Automatically hashes the password on create/update if it is provided.
 */
export default class UserObserver extends Observer<UserAttributes> {

    /**
     * Called when the User model is being created.
     * Automatically hashes the password if it is provided.
     * @param data The User data being created.
     * @returns The processed User data.
     */
    async creating(data: UserAttributes): Promise<UserAttributes> {
        data = this.onPasswordChange(data)
        data = await this.addDefaultAclGroup(data)
        data = await this.updateRoles(data)
        return data
    }

    private async addDefaultAclGroup(data: UserAttributes): Promise<UserAttributes> {
        if(!data.aclGroups || (Array.isArray(data.aclGroups) && data.aclGroups.length === 0)) {
            data.aclGroups = [TestAuthEnvironment.getInstance().defaultAclGroup()]
        }
        return data
    }

    /**
     * Called after the User model has been created.
     * @param data The User data that has been created.
     * @returns The processed User data.
     */
    async created(data: UserAttributes): Promise<UserAttributes> {
        return data
    }

    /**
     * Updates the roles of the user based on the groups they belong to.
     * Retrieves the roles associated with each group the user belongs to from the permissions configuration.
     * @param data The User data being created/updated.
     * @returns The processed User data with the updated roles.
     */
    async updateRoles(data: UserAttributes): Promise<UserAttributes> {
        let updatedRoles: string[] = [];
        const groups = (data?.[AuthenticableUserModel.ACL_GROUPS] ?? []) as string[]

        const basicAclService = TestAuthEnvironment.getInstance().aclService
        
        for(const group of groups) {
            const relatedRoles = basicAclService.getGroupRoles(group)
            const relatedRolesNames = relatedRoles.map(role => role.name)

            updatedRoles = [
                ...updatedRoles, 
                ...relatedRolesNames
            ]
        }

        data[AuthenticableUserModel.ACL_ROLES] = updatedRoles

        return data
    }

    /**
     * Automatically hashes the password if it is provided.
     * @param data The User data being created/updated.
     * @returns The processed User data.
     */
    onPasswordChange(data: UserAttributes): UserAttributes {
        if(!data[AuthenticableUserModel.PASSWORD]) {
            return data
        }
        
        // Hash the password
        data[AuthenticableUserModel.HASHED_PASSWORD] = TestAuthEnvironment.getInstance().cryptoService.hash(data[AuthenticableUserModel.PASSWORD] as string);

        // Delete the password from the data
        delete data[AuthenticableUserModel.PASSWORD];

        return data
    }

}
