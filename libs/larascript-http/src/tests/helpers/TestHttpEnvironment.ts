import { AbstractAuthMiddleware } from "@/http/base/AbstractAuthMiddleware.js";
import RequestContext from "@/http/context/RequestContext.js";
import Http from "@/http/services/Http.js";
import HttpService from "@/http/services/HttpService.js";
import { AsyncSessionService, IAsyncSessionService } from "@larascript-framework/async-session";
import { IAuthEnvironmentConfig, IAuthService, IUserModel } from "@larascript-framework/contracts/auth";
import { IHttpContext, IHttpService, MiddlewareConstructor } from "@larascript-framework/contracts/http";
import { aclConfig, authConfig, AuthEnvironment } from "@larascript-framework/larascript-auth";
import { BaseSingleton, EnvironmentTesting } from "@larascript-framework/larascript-core";
import { DatabaseEnvironment } from "@larascript-framework/larascript-database";
import { ILoggerService } from "@larascript-framework/larascript-logger";
import path from "path";

export type Options = {
    withDatabase?: boolean;
}

const DEFAULTS: Options = {
    withDatabase: true,
}

export class TestHttpEnvironment extends BaseSingleton<Options> {
    asyncSession!: IAsyncSessionService;

    get httpService(): IHttpService {
        return Http.getInstance().getHttpService();
    }

    getAuthTestEnvironment(): AuthEnvironment {
        return AuthEnvironment.getInstance();
    }

    getDatabaseTestEnvironment(): DatabaseEnvironment {
        return DatabaseEnvironment.getInstance();
    }

    static create(options: Options = {}) {
        return TestHttpEnvironment.getInstance({
            ...DEFAULTS,
            ...options,
        });
    }
    
    async boot() {
        this.asyncSession = AsyncSessionService.getInstance();

        // Create the database environment
        await DatabaseEnvironment.create({
            boot: this.config?.withDatabase ?? DEFAULTS.withDatabase,
        }).boot();

        // Create the auth environment
        const authEnvirnonmentConfig: IAuthEnvironmentConfig = {
            authConfig: {
                ...authConfig,
                drivers: {
                    jwt: {
                        ...authConfig.drivers.jwt,
                        options: {
                            ...authConfig.drivers.jwt.options,
                            secret: 'test',
                            expiresInMinutes: 60 * 24, // 24 hours
                        }
                    }
                }
            },
            aclConfig: aclConfig,
            secretKey: 'test',
            dependencies: {
                asyncSessionService: this.asyncSession,
            },
            dropAndCreateTables: true,
            boot: this.config?.withDatabase ?? DEFAULTS.withDatabase,
        }
        await AuthEnvironment.create(authEnvirnonmentConfig).boot();
        
        const httpService = new HttpService(
            {
                enabled: true,
                port: 0, // Use dynamic port allocation
                beforeAllMiddlewares: [],
                afterAllMiddlewares: [],
                extendExpress: () => {},
                logging: {
                    requests: true,
                },
            }   
        )

        // Create the http environment
        Http.init(httpService, {
            environment: EnvironmentTesting,
            uploadDirectory: path.join(process.cwd(), 'storage/uploads'),
            dependencies: {
                requestContext: new RequestContext(),
                loggerService: DatabaseEnvironment.getInstance().logger ?? {} as unknown as ILoggerService,
                asyncSession: this.asyncSession,
                authService: this.config?.withDatabase ? AuthEnvironment.getInstance().authService as unknown as IAuthService : undefined,
                databaseService: this.config?.withDatabase ? DatabaseEnvironment.getInstance().databaseService : undefined,
                queryBuilderService: this.config?.withDatabase ? DatabaseEnvironment.getInstance().eloquentQueryBuilder : undefined,
            }
        });

        // Initialize and listen to the http service
        await Http.getInstance().boot();
    }

    /**
     * Creates a mock authorize user middleware
     * @param user - The user to authorize
     * @returns The mock authorize user middleware
     */
    createMockAuthorizeUserMiddleware(user: IUserModel): MiddlewareConstructor {
        return class extends AbstractAuthMiddleware {
            async execute(context: IHttpContext): Promise<void> {
                await TestHttpEnvironment.getInstance().getAuthTestEnvironment().authorizeUser(user);
                context.getRequest().user = user;
                this.next();
            }
        }
    }
}
