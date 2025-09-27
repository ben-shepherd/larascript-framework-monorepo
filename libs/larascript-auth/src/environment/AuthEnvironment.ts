import { resetApiTokenTable } from "@/auth/schema/resetApiTokenTable.js";
import { resetUserTable } from "@/auth/schema/resetUserTable.js";
import { IAsyncSessionService } from "@larascript-framework/async-session";
import { ApiTokenModelOptions, IAuthConfig, IAuthEnvironmentConfig, IAuthEnvironmentDependencies, IAuthService, IUserAttributes, IUserModel } from "@larascript-framework/contracts/auth";
import { IDatabaseService } from "@larascript-framework/contracts/database/database";
import { IEloquentQueryBuilderService } from "@larascript-framework/contracts/database/eloquent";
import { CryptoService, ICryptoService } from "@larascript-framework/crypto-js";
import { BasicACLService, IAclConfig, IBasicACLService } from "@larascript-framework/larascript-acl";
import { aclConfig, authConfig, AuthService, createApiTokenTable, createUserTable } from "@larascript-framework/larascript-auth";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { IModel } from "@larascript-framework/larascript-database";

const DEPENDENCIES_DEFAULTS: IAuthEnvironmentDependencies = {
    databaseService: {} as IDatabaseService,
    eloquentQueryBuilderService: {} as IEloquentQueryBuilderService,
    asyncSessionService: {} as IAsyncSessionService,
}

const CONFIG_DEFAULTS: IAuthEnvironmentConfig = {
    authConfig: authConfig,
    aclConfig: aclConfig,
    secretKey: '',
    dependencies: DEPENDENCIES_DEFAULTS,
    boot: true,
    dropAndCreateTables: false,
}

export class AuthEnvironment extends BaseSingleton<IAuthEnvironmentConfig> {
    authConfig!: IAuthConfig;
    aclConfig!: IAclConfig;
    authService!: IAuthService;
    databaseService!: IDatabaseService;
    eloquentQueryBuilderService!: IEloquentQueryBuilderService;
    asyncSessionService!: IAsyncSessionService;
    cryptoService!: ICryptoService;
    aclService!: IBasicACLService;

    constructor(config: IAuthEnvironmentConfig) {
        super({
            ...CONFIG_DEFAULTS,
            ...(config),
        });

        const { dependencies, secretKey } = config;
        this.databaseService = dependencies.databaseService;
        this.eloquentQueryBuilderService = dependencies.eloquentQueryBuilderService;
        this.asyncSessionService = dependencies.asyncSessionService;
        this.cryptoService = new CryptoService({
            secretKey: secretKey,
        });
        
    }

    static create(config: IAuthEnvironmentConfig) {
        AuthEnvironment.getInstance(config)
        AuthEnvironment.getInstance().authConfig = config.authConfig;
        AuthEnvironment.getInstance().aclConfig = config.aclConfig;
        return AuthEnvironment.getInstance();
    }

    async boot() {
        this.aclService = new BasicACLService(this.aclConfig);
        this.authService = new AuthService(
            this.authConfig,
            this.aclConfig,
            this.asyncSessionService
        )

        if(this.getConfig()?.boot) {
            await this.authService.boot();
            await this.setupTables();
        }
    }

    async setupTables() {
        if(this.getConfig()?.dropAndCreateTables) {
            await resetUserTable();
            await resetApiTokenTable();
            return;
        }

        await createUserTable();
        await createApiTokenTable();
    }

    getUserDefaultAttributes(): IUserAttributes {
        return this.authService.getUserFactory().getDefinition() as IUserAttributes;
    }

    async createUser(attributes: Partial<IUserAttributes> & { password: string }) {
        attributes.hashedPassword = await this.authService.getJwt().hashPassword(attributes.password);
        const user = this.authService.getUserFactory().create({
            ...this.getUserDefaultAttributes(),
            ...attributes,
        });
        
        await (user as unknown as IModel).save();

        return user;
    }

    async createJwtFromUser(user: IUserModel, scopes: string[], options: ApiTokenModelOptions) {
        const jwt = await this.authService.getJwt().createJwtFromUser(user, scopes, options);
        return jwt
    }

    async createAndAuthorizeUser(attributes: Partial<IUserAttributes> & { password: string }) {
        const user = await this.createUser(attributes);
        await this.authorizeUser(user);
        return user;
    }

    async authorizeUser(user: IUserModel) {
        await this.authService.getJwt().authorizeUser(user);
    }

    defaultAclGroup(): string {
        return this.aclService.getDefaultGroup().name;
    }
}