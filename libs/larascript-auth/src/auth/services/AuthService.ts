import { IAclConfig, IBasicACLService } from "@larascript-framework/larascript-acl";
import { BaseAdapter } from "@larascript-framework/larascript-core";
import { BaseAuthAdapterTypes, IAuthConfig, IAuthService, IJwtAuthService, IUserModel, IUserRepository } from "../interfaces";

/**
 * AuthService provides authentication and authorization services,
 * including management of authentication adapters and integration with ACL.
 * 
 * @class Auth
 * @extends BaseAdapter<BaseAuthAdapterTypes>
 * @implements IAuthService
 * 
 * @param {IAuthConfig} config - The authentication configuration, including available drivers.
 * @param {IAclConfig} aclConfig - The ACL configuration.
 * 
 * @property {IBasicACLService} aclService - The ACL service instance.
 * 
 * @method setAclService - Sets the ACL service instance.
 * @method acl - Returns the current ACL service instance.
 * @method boot - Boots the authentication service and its adapters.
 * @method getJwt - Returns the JWT authentication adapter.
 * @method check - Checks if the current user is authenticated.
 * @method user - Returns the currently authenticated user, if any.
 * @method getUserRepository - Returns the user repository.
 * 
 * @protected
 * @method registerAdapters - Registers authentication adapters from the config.
 * @method bootAdapters - Boots all registered adapters.
 */

class Auth extends BaseAdapter<BaseAuthAdapterTypes> implements IAuthService {

    protected aclService!: IBasicACLService;

    constructor(
        protected readonly config: IAuthConfig,
        protected readonly aclConfig: IAclConfig,
    ) {
        super();
    }

    /**
     * Sets the ACL service
     * @param aclService - The ACL service
     */
    setAclService(aclService: IBasicACLService): void {
        this.aclService = aclService;
    }

    /**
     * Boots the auth service
     * @returns A promise that resolves when the auth service is booted
     */
    public async boot(): Promise<void> {

        if(!this.aclService) {
            throw new Error('ACL service is not set');
        }

        await this.registerAdapters();
        await this.bootAdapters();
    }

    /** 
     * Registers the adapters
     */
    protected registerAdapters(): void {
        for (const config of this.config.drivers) {
            const {
                name,
                driver: adapterConstructor,
                options
            } = config

            const adapterInstance = new adapterConstructor(options);
            this.addAdapterOnce(name, adapterInstance);
        }
    }

    /**
     * Get the JWT adapter
     * @returns The JWT adapter
     */
    public getJwt(): IJwtAuthService {
        return this.getAdapter('jwt') as IJwtAuthService;
    }

    /**
     * Boots the adapters
     */
    protected async bootAdapters(): Promise<void> {
        for (const adapterInstance of Object.values(this.adapters)) {
            await adapterInstance.boot();
        }
    }

    /**
     * Get the ACL service
     * @returns The ACL service
     */
    public acl(): IBasicACLService {
        return this.aclService;
    }

    /**
     * Check if the user is authenticated
     * @returns True if the user is authenticated, false otherwise
     */
    public async check(): Promise<boolean> {
        return await this.getJwt().check();
    }

    /**
     * Get the user
     * @returns The user
     */
    public async user(): Promise<IUserModel | null> {
        return await this.getJwt().user();
    }

    /**
     * Get the user repository
     * @returns The user repository
     */
    public getUserRepository(): IUserRepository {
        return this.getJwt().getUserRepository()
    }


}

export default Auth;