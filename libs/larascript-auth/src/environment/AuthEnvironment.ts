import { AUTH_ENVIRONMENT_DEFAULTS } from "@/auth/config/environment.js";
import { createApiTokenTable } from "@/auth/schema/createApiTokenTable.js";
import { createUserTable } from "@/auth/schema/createUserTable.js";
import { resetApiTokenTable } from "@/auth/schema/resetApiTokenTable.js";
import { resetUserTable } from "@/auth/schema/resetUserTable.js";
import AuthService from "@/auth/services/AuthService.js";
import { AsyncSessionService, IAsyncSessionService } from "@larascript-framework/async-session";
import { ApiTokenModelOptions, IAuthConfig, IAuthEnvironmentConfig, IAuthService, IUserAttributes, IUserModel } from "@larascript-framework/contracts/auth";
import { CryptoService, ICryptoService } from "@larascript-framework/crypto-js";
import { BasicACLService, IAclConfig, IBasicACLService } from "@larascript-framework/larascript-acl";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { DatabaseEnvironment, IModel } from "@larascript-framework/larascript-database";

/**
 * Represents the authentication environment configuration and services.
 * Extends the BaseSingleton class to ensure a single instance.
 */
export class AuthEnvironment extends BaseSingleton<IAuthEnvironmentConfig> {
    authConfig!: IAuthConfig;
    aclConfig!: IAclConfig;
    authService!: IAuthService;
    asyncSessionService!: IAsyncSessionService;
    cryptoService!: ICryptoService;
    aclService!: IBasicACLService;

    /**
     * Constructs an AuthEnvironment instance with the provided configuration.
     * @param {IAuthEnvironmentConfig} config - The configuration for the authentication environment.
     */
    constructor(config: IAuthEnvironmentConfig) {
        super({
            ...AUTH_ENVIRONMENT_DEFAULTS,
            ...(config),
        });
        this.setDependencies(config);
    }

    /**
     * Creates and returns an instance of AuthEnvironment.
     * @param {IAuthEnvironmentConfig} config - The configuration for the authentication environment.
     * @returns {AuthEnvironment} The instance of AuthEnvironment.
     */
    static create(config: Partial<IAuthEnvironmentConfig> = AUTH_ENVIRONMENT_DEFAULTS) {
        config = {
            ...AUTH_ENVIRONMENT_DEFAULTS,
            ...config,
        }
        if(!config.authConfig) {
            throw new Error('authConfig is required');
        }
        if(!config.aclConfig) {
            throw new Error('aclConfig is required');
        }
        if(!config.secretKey) {
            throw new Error('secretKey is required');
        }
        AuthEnvironment.getInstance(config)
        AuthEnvironment.getInstance().authConfig = config.authConfig;
        AuthEnvironment.getInstance().aclConfig = config.aclConfig;
        AuthEnvironment.getInstance().setDependencies(config as IAuthEnvironmentConfig);
        AuthEnvironment.getInstance().createServices();
        return AuthEnvironment.getInstance();
    }

    get databaseEnvironment() {
        return DatabaseEnvironment.getInstance();
    }

    /**
     * Sets the dependencies for the authentication environment.
     * @param {IAuthEnvironmentConfig} dependencies - The dependencies for the authentication environment.
     */
    setDependencies(config: IAuthEnvironmentConfig) {
        const { secretKey, dependencies } = config;
        this.asyncSessionService = dependencies.asyncSessionService ?? new AsyncSessionService();
        this.cryptoService = new CryptoService({
            secretKey: secretKey ?? "",
        });
    }

    createServices() {
        this.aclService = new BasicACLService(this.aclConfig);
        this.authService = new AuthService(
            this.authConfig,
            this.aclConfig,
            this.asyncSessionService
        )
    }

    /**
     * Boots the authentication environment, initializing services and setting up tables if configured.
     */
    async boot() {
        if(this.getConfig()?.boot) {
            await this.authService.boot();
            await this.setupTables();
        }
    }

    /**
     * Sets up the necessary tables for authentication, optionally dropping and recreating them.
     */
    async setupTables() {
        const schema = this.databaseEnvironment.databaseService.schema()

        if(this.getConfig()?.dropAndCreateTables) {
            await resetUserTable(schema);
            await resetApiTokenTable(schema);
            return;
        }

        await createUserTable(schema);
        await createApiTokenTable(schema);
    }

    /**
     * Retrieves the default attributes for a user.
     * @returns {IUserAttributes} The default user attributes.
     */
    getUserDefaultAttributes(): IUserAttributes {
        return this.authService.getUserFactory().getDefinition() as IUserAttributes;
    }

    /**
     * Creates a new user with the specified attributes, hashing the password.
     * @param {Partial<IUserAttributes> & { password: string }} attributes - The attributes for the new user.
     * @returns {Promise<IUserModel>} The created user model.
     */
    async createUser(attributes: Partial<IUserAttributes> & { password: string }) {
        attributes.hashedPassword = await this.authService.getJwt().hashPassword(attributes.password);
        const user = this.authService.getUserFactory().create({
            ...this.getUserDefaultAttributes(),
            ...attributes,
        });
        
        await (user as unknown as IModel).save();

        return user;
    }

    /**
     * Creates a JWT for a user with the specified scopes and options.
     * @param {IUserModel} user - The user model.
     * @param {string[]} scopes - The scopes for the JWT.
     * @param {ApiTokenModelOptions} options - The options for the JWT.
     * @returns {Promise<string>} The created JWT.
     */
    async createJwtFromUser(user: IUserModel, scopes: string[], options: ApiTokenModelOptions) {
        const jwt = await this.authService.getJwt().createJwtFromUser(user, scopes, options);
        return jwt
    }

    /**
     * Creates and authorizes a new user with the specified attributes.
     * @param {Partial<IUserAttributes> & { password: string }} attributes - The attributes for the new user.
     * @returns {Promise<IUserModel>} The created and authorized user model.
     */
    async createAndAuthorizeUser(attributes: Partial<IUserAttributes> & { password: string }) {
        const user = await this.createUser(attributes);
        await this.authorizeUser(user);
        return user;
    }

    /**
     * Authorizes a user by creating a JWT.
     * @param {IUserModel} user - The user model to authorize.
     */
    async authorizeUser(user: IUserModel) {
        await this.authService.getJwt().authorizeUser(user);
    }

    /**
     * Retrieves the default ACL group name.
     * @returns {string} The name of the default ACL group.
     */
    defaultAclGroup(): string {
        return this.aclService.getDefaultGroup().name;
    }
}