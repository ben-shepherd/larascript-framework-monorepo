import { AsyncSessionService, IAsyncSessionService } from "@larascript-framework/async-session";
import { IBasicACLService } from "@larascript-framework/larascript-acl";
import { IAuthAdapter, IUserModel } from "../interfaces";

/**
 * Base authentication adapter class that implements the IAuthAdapter interface.
 * Provides core functionality for authentication adapters.
 * @template Config - The configuration type that extends IBaseAuthConfig
 */
export  abstract class BaseAuthAdapter<Config extends Record<string, unknown>> implements IAuthAdapter<Config> {

    protected asyncSession!: IAsyncSessionService;

    protected aclService!: IBasicACLService;

    constructor(
        protected readonly config: Config,
        aclService: IBasicACLService
    ) {
        this.asyncSession = new AsyncSessionService();
        this.aclService = aclService;
    }
    
    /**
     * Get the user
     * @returns The user
     */
    abstract user(): Promise<IUserModel | null>;

    /**
     * Check if the user is authenticated
    abstract check(): Promise<boolean>;

    /**
     * Boots the adapter
     * @returns A promise that resolves when the adapter is booted
     */
    public async boot(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Retrieves the current configuration
     * @returns The current configuration object
     */

    getConfig(): Config {
        return this.config;
    }

    /**
     * Authorize a user
     * @param user 
     */
    authorizeUser(user: IUserModel) {
        this.asyncSession.setSessionData({ userId: user.getId() })
    }

    /**
     * Check if the user is authenticated
     * @returns True if the user is authenticated, false otherwise
     */
    async check(): Promise<boolean> {
        return !!this.asyncSession.getSessionData().userId
    }


}

export default BaseAuthAdapter;

