import { IApiTokenAttributes } from "@larascript-framework/larascript-auth";
import { Observer } from "@larascript-framework/larascript-observer";
import { authJwt } from "@src/core/domains/auth/services/JwtAuthService";
import { auth } from "@src/core/services/AuthService";
import UserRepository from "../repositories/UserRepository";

interface IApiTokenObserverData extends IApiTokenAttributes {}

export default class ApiTokenObserver extends Observer<IApiTokenObserverData> {  
    
    protected readonly userRepository = new UserRepository();

    /**
     * Called when a data object is being created.
     * @param data The model data being created.
     * @returns The processed model data.
     */
    async creating(data: IApiTokenObserverData): Promise<IApiTokenObserverData> {
        data = await this.addGroupScopes(data)
        return data
    }

    /**
     * Adds scopes from groups the user is a member of to the scopes of the ApiToken being created.
     * @param data The ApiToken data being created.
     * @returns The ApiToken data with the added scopes.
     */

    async addGroupScopes(data: IApiTokenObserverData): Promise<IApiTokenObserverData> {
        const user = await authJwt().getUserRepository().findByIdOrFail(data.userId)

        if(!user) {
            return data
        }

        const userGroups = user.getAclGroups() ?? []

        for(const userGroup of userGroups) {
            const scopes = auth().acl().getGroupScopes(userGroup)

            data.scopes = [
                ...data.scopes,
                ...scopes
            ]
        }

        return data
    }

}