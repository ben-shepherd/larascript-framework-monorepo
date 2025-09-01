import { IBaseEvent } from "@larascript-framework/larascript-events";
import { Observer } from "@larascript-framework/larascript-observer";
import { TClassConstructor } from "@larascript-framework/larascript-utils";
import UserCreatedListener from "@src/app/events/listeners/UserCreatedListener";
import { UserAttributes } from "@src/app/models/auth/User";
import { app } from "@src/core/services/App";
import { cryptoService } from "@src/core/services/CryptoService";

/**
 * Observer for the User model.
 * 
 * Automatically hashes the password on create/update if it is provided.
 */
export default class UserObserver extends Observer<UserAttributes> {

    protected userCreatedListener: TClassConstructor<IBaseEvent> = UserCreatedListener;

    /**
     * Called when the User model is being created.
     * Automatically hashes the password if it is provided.
     * @param data The User data being created.
     * @returns The processed User data.
     */
    async creating(data: UserAttributes): Promise<UserAttributes> {
        data = this.onPasswordChange(data)
        data = await this.updateRoles(data)
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
        const groups = data?.groups ?? []

        const basicAclService = app('acl.basic')
        
        for(const group of groups) {
            const relatedRoles = basicAclService.getGroupRoles(group)
            const relatedRolesNames = relatedRoles.map(role => role.name)

            updatedRoles = [
                ...updatedRoles,
                ...relatedRolesNames
            ]
        }

        data.roles = updatedRoles

        return data
    }

    /**
     * Automatically hashes the password if it is provided.
     * @param data The User data being created/updated.
     * @returns The processed User data.
     */
    onPasswordChange(data: UserAttributes): UserAttributes {
        if(!data.password) {
            return data
        }
        
        // Hash the password
        data.hashedPassword = cryptoService().hash(data.password);

        // Delete the password from the data
        delete data.password;

        return data
    }

}
