import { IAsyncSessionService } from "@larascript-framework/async-session";
import { CryptoService, ICryptoService } from "@larascript-framework/crypto-js";
import { BasicACLService, IAclConfig, IBasicACLService } from "@larascript-framework/larascript-acl";
import { JsonWebTokenError } from "jsonwebtoken";
import { DataTypes } from "sequelize";
import BaseAuthAdapter from "../base/BaseAuthAdapter";
import { JWTConfigException, JWTSecretException, UnauthorizedException } from "../exceptions";
import { JwtFactory } from "../factory/JwtFactory";
import { ApiTokenModelOptions, IApiTokenModel, IApiTokenRepository, IJwtAuthService, IJwtConfig, IOneTimeAuthenticationService, IUserModel, IUserRepository } from "../interfaces";
import { createJwt } from "../utils/createJwt";
import { decodeJwt } from "../utils/decodeJwt";
import { generateToken } from "../utils/generateToken";
import OneTimeAuthenticationService from "./OneTimeAuthenticationService";

/**
 * JwtAuthService is an authentication adapter that implements JWT (JSON Web Token) based authentication.
 * It extends BaseAuthAdapter and provides JWT-specific authentication functionality.
 * 
 * This service:
 * - Handles JWT token creation and validation
 * - Manages user authentication via email/password credentials
 * - Provides API token management for machine-to-machine auth
 * - Configures auth-related routes and middleware
 * - Integrates with the application's ACL (Access Control List) system
 * 
 * The service can be accessed via the 'auth.jwt' helper:
 * ```ts
 * const jwtAuth = authJwt();
 * const token = await jwtAuth.attemptCredentials(email, password);
 * ```
 */
class JwtAuthService extends BaseAuthAdapter<IJwtConfig> implements IJwtAuthService {

    protected _oneTimeService = new OneTimeAuthenticationService()

    protected asyncSession!: IAsyncSessionService;

    protected userRepository!: IUserRepository;

    protected apiTokenRepository!: IApiTokenRepository;

    protected cryptoService!: ICryptoService;

    protected aclService!: IBasicACLService;

    constructor(
        config: IJwtConfig, 
        aclConfig: IAclConfig) {
        super(config, aclConfig);
        this.userRepository = new this.config.options.repository.user();
        this.apiTokenRepository = new this.config.options.repository.apiToken();
        this.cryptoService = new CryptoService({
            secretKey: config.options.secret,
        });
        this.aclService = new BasicACLService(aclConfig);
    }

    /**
     * Get the config
     * @returns 
     */
    public getConfig(): IJwtConfig {
        return this.config
    }

    /**
     * Get the one time authentication service
     * @returns 
     */
    public oneTimeService(): IOneTimeAuthenticationService {
        return this._oneTimeService
    }

    /**
     * Get the JWT secret
     * 
     * @returns 
     */
    private getJwtSecret(): string {
        if (!this.config.options.secret) {
            throw new JWTSecretException()
        }
        return this.config.options.secret
    }

    /**
     * Get the JWT expires in minutes
     * 
     * @returns 
     */

    private getJwtExpiresInMinutes(): number {
        if (!this.config.options.expiresInMinutes) {
            throw new JWTConfigException()
        }
        return this.config.options.expiresInMinutes
    }

    /**
     * Attempt login with credentials
     * @param email 
     * @param password 
     * @returns 
     */
    async attemptCredentials(email: string, password: string, scopes: string[] = [], options?: ApiTokenModelOptions): Promise<string> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException()
        }

        const hashedPassword = user.getHashedPassword()

        if (!hashedPassword) {
            throw new UnauthorizedException()
        }

        if (!this.cryptoService.verifyHash(password, hashedPassword)) {
            throw new UnauthorizedException()
        }

        // Generate the api token
        const apiToken = await this.buildApiTokenByUser(user, scopes, options ?? {})

        if (typeof options?.expiresAfterMinutes === 'number') {
            const expiresAt = new Date(Date.now() + options.expiresAfterMinutes * 60 * 1000)
            await apiToken.setRevokedAt(expiresAt)
        }

        // Save
        await this.apiTokenRepository.create({
            userId: user.getId(),
            token: apiToken.getToken(),
            scopes: apiToken.getScopes(),
            revokedAt: apiToken.getRevokedAt(),
            expiresAt: apiToken.getExpiresAt()
        })

        // Generate the JWT token
        return this.generateJwt(apiToken)
    }

    /**
     * Create a new ApiToken model from the User
     * @param user 
     * @returns 
     */
    protected async buildApiTokenByUser(user: IUserModel, scopes: string[] = [], options: ApiTokenModelOptions = {}): Promise<IApiTokenModel> {
        const apiToken = new this.config.options.factory.apiToken().create({
            userId: user.getId(),
            token: generateToken(),
            scopes: [...this.aclService.getRoleScopesFromUser(user), ...scopes],
            revokedAt: null,
            options: options
        })

        if (options?.expiresAfterMinutes) {
            const expiresAt = new Date(Date.now() + options.expiresAfterMinutes * 60 * 1000)
            await apiToken.setExpiresAt(expiresAt)
        }

        return apiToken
    }

    /**
     * Generate a JWT token
     * @param apiToken 
     * @returns 
     */
    protected generateJwt(apiToken: IApiTokenModel) {
        if (!apiToken?.getUserId()) {
            throw new Error('Invalid token');
        }

        // Create the payload
        const payload = JwtFactory.createUserIdAndPayload(apiToken.getUserId(), apiToken.getToken());

        // Get the expires in minutes. Example: 1m
        const expiresIn = `${this.getJwtExpiresInMinutes()}m`

        // Create the JWT token
        return createJwt(this.getJwtSecret(), payload, expiresIn)
    }

    /**
     * Attempt authentication against a JWT

     * @param token 
     * @returns 
     */
    async attemptAuthenticateToken(token: string): Promise<IApiTokenModel | null> {
        try {
            const { token: decodedToken, uid: decodedUserId } = decodeJwt(this.getJwtSecret(), token);

            const apiToken = await this.apiTokenRepository.findOneActiveToken(decodedToken)

            if (!apiToken) {
                throw new UnauthorizedException()
            }

            const user = await this.userRepository.findById(decodedUserId)

            if (!user) {
                throw new UnauthorizedException()
            }

            if (apiToken.hasExpired()) {
                throw new UnauthorizedException()
            }

            return apiToken
        }
        catch (err) {
            if (err instanceof JsonWebTokenError) {
                throw new UnauthorizedException()
            }
        }

        return null
    }

    /**
     * Create a JWT token from a user
     * @param user 
     * @returns 
     */
    public async createJwtFromUser(user: IUserModel, scopes: string[] = [], options: ApiTokenModelOptions = {}): Promise<string> {
        const apiToken = await this.buildApiTokenByUser(user, scopes, options)
        await this.apiTokenRepository.create({
            userId: user.getId(),
            token: apiToken.getToken(),
            scopes: apiToken.getScopes(),
            revokedAt: apiToken.getRevokedAt(),
            expiresAt: apiToken.getExpiresAt()
        })
        return this.generateJwt(apiToken)
    }

    /**
     * Refresh a token
     * @param apiToken 
     * @returns 
     */

    refreshToken(apiToken: IApiTokenModel): string {
        return this.generateJwt(apiToken)
    }

    /**
     * Revokes a token
     * @param apiToken 
     * @returns 
     */

    async revokeToken(apiToken: IApiTokenModel): Promise<void> {
        if (apiToken?.getRevokedAt()) {
            return;
        }

        await this.apiTokenRepository.revokeToken(apiToken)
    }

    /**
     * Revokes all tokens for a user
     * @param userId 
     * @returns 
     */
    async revokeAllTokens(userId: string | number): Promise<void> {
        await this.apiTokenRepository.revokeAllTokens(userId)
    }

    /**
     * Get the router
     * @returns 
     */
    // getRouter(): IRouter {
    //     if (!this.config.routes.enabled) {
    //         return new Router();
    //     }

    //     return Route.group({
    //         prefix: '/auth',
    //         controller: AuthController,
    //         config: {
    //             adapter: 'jwt'
    //         }
    //     }, (router) => {


    //         if (this.config.routes.endpoints.login) {
    //             router.post('/login', 'login');
    //         }

    //         if (this.config.routes.endpoints.register) {
    //             router.post('/register', 'register');
    //         }

    //         router.group({
    //             middlewares: [AuthorizeMiddleware]
    //         }, (router) => {

    //             if (this.config.routes.endpoints.login) {
    //                 router.get('/user', 'user');
    //             }

    //             if (this.config.routes.endpoints.update) {
    //                 router.patch('/update', 'update');
    //             }

    //             if (this.config.routes.endpoints.refresh) {
    //                 router.post('/refresh', 'refresh');
    //             }

    //             if (this.config.routes.endpoints.logout) {
    //                 router.post('/logout', 'logout');
    //             }

    //         })

    //     })
    // }

    /**
     * Get the user repository
     * @returns The user repository
     */
    public getUserRepository(): IUserRepository {
        return this.userRepository
    }

    /**
     * Get the create user table schema
     * @returns 
     */
    public getCreateUserTableSchema() {
        return {
            email: DataTypes.STRING,
            hashedPassword: DataTypes.STRING,
            groups: DataTypes.ARRAY(DataTypes.STRING),
            roles: DataTypes.ARRAY(DataTypes.STRING),
        }
    }

    /**
     * Get the create api token table schema
     * @returns 
     */
    public getCreateApiTokenTableSchema() {
        return {
            userId: DataTypes.STRING,
            token: DataTypes.STRING,
            scopes: DataTypes.JSON,
            revokedAt: DataTypes.DATE
        }
    }

    /**
     * Get the user
     * @returns The user
     */
    async user(): Promise<IUserModel | null> {
        if (!await this.check()) {
            return null
        }

        return await this.userRepository.findById(
            this.asyncSession.getSessionData().userId as string
        )
    }

}


export default JwtAuthService;
