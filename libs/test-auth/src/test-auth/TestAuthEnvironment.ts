import { aclConfig } from "@/config/acl.config.js";
import { authConfig } from "@/config/auth.config.js";
import { IAsyncSessionService } from "@larascript-framework/async-session";
import { IAuthConfig, IAuthService } from "@larascript-framework/contracts/auth";
import { IDatabaseService } from "@larascript-framework/contracts/database/database";
import { IEloquentQueryBuilderService } from "@larascript-framework/contracts/database/eloquent";
import { CryptoService, ICryptoService } from "@larascript-framework/crypto-js";
import { BasicACLService, IAclConfig, IBasicACLService } from "@larascript-framework/larascript-acl";
import { AuthService } from "@larascript-framework/larascript-auth";
import { BaseSingleton } from "@larascript-framework/larascript-core";

type Config = {
    databaseService: IDatabaseService;
    eloquentQueryBuilderService: IEloquentQueryBuilderService;
    asyncSessionService: IAsyncSessionService;
}

const DEFAULTS: Config = {
    databaseService: {} as IDatabaseService,
    eloquentQueryBuilderService: {} as IEloquentQueryBuilderService,
    asyncSessionService: {} as IAsyncSessionService,
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
        await this.authService.boot();
    }
}