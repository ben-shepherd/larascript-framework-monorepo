import { aclConfig } from "@/config/acl.config.js";
import { authConfig } from "@/config/auth.config.js";
import { resetApiTokenTable } from "@/schema/resetApiTokenTable.js";
import { resetUserTable } from "@/schema/resetUserTable.js";
import { IAsyncSessionService } from "@larascript-framework/async-session";
import { ApiTokenModelOptions, IAuthConfig, IAuthService, IUserAttributes, IUserModel } from "@larascript-framework/contracts/auth";
import { IDatabaseService } from "@larascript-framework/contracts/database/database";
import { IEloquentQueryBuilderService } from "@larascript-framework/contracts/database/eloquent";
import { CryptoService, ICryptoService } from "@larascript-framework/crypto-js";
import { BasicACLService, IAclConfig, IBasicACLService } from "@larascript-framework/larascript-acl";
import { AuthService } from "@larascript-framework/larascript-auth";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { IModel } from "@larascript-framework/larascript-database";

type Config = {
    databaseService: IDatabaseService;
    eloquentQueryBuilderService: IEloquentQueryBuilderService;
    asyncSessionService: IAsyncSessionService;
    withDatabase: boolean;
}

const DEFAULTS: Config = {
    databaseService: {} as IDatabaseService,
    eloquentQueryBuilderService: {} as IEloquentQueryBuilderService,
    asyncSessionService: {} as IAsyncSessionService,
    withDatabase: true,
}

export class TestAuthEnvironment extends BaseSingleton<Config> {
    authConfig!: IAuthConfig;
    aclConfig!: IAclConfig;
    authService!: IAuthService;
    databaseService!: IDatabaseService;
    eloquentQueryBuilderService!: IEloquentQueryBuilderService;
    asyncSessionService!: IAsyncSessionService;
    cryptoService!: ICryptoService;
    aclService!: IBasicACLService;

    constructor(config: Config) {
        super({
            ...DEFAULTS,
            ...config,
        });
        this.databaseService = config.databaseService;
        this.eloquentQueryBuilderService = config.eloquentQueryBuilderService;
        this.asyncSessionService = config.asyncSessionService;
        this.cryptoService = new CryptoService({
            secretKey: "test",
        });
        
    }

    static create(config?: Partial<Config>, _authConfig: IAuthConfig = authConfig, _aclConfig: IAclConfig = aclConfig) {
        TestAuthEnvironment.getInstance(config)
        TestAuthEnvironment.getInstance().authConfig = _authConfig;
        TestAuthEnvironment.getInstance().aclConfig = _aclConfig;
        return TestAuthEnvironment.getInstance();
    }

    async boot() {
        this.aclService = new BasicACLService(this.aclConfig);
        this.authService = new AuthService(
            this.authConfig,
            this.aclConfig,
            this.asyncSessionService
        )

        if(this.getConfig()?.withDatabase) {
            await this.authService.boot();
            await this.setupTables();
        }
    }

    async setupTables() {
        await resetUserTable();
        await resetApiTokenTable();
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