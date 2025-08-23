import { UnauthorizedException } from "@/auth/exceptions/UnauthorizedException";
import { IApiTokenFactory, IUserFactory } from "@/auth/interfaces/factory";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { IAclConfig } from "@larascript-framework/larascript-acl";
import {
    IApiTokenRepository,
    IAuthConfig,
    IJwtAuthService,
    IUserRepository
} from "../auth/interfaces";
import AuthService from "../auth/services/AuthService";
import { TestApiTokenFactory } from "./factory/TestApiTokenFactory";
import { TestUserFactory } from "./factory/TestUserFactory";
import { TestApiTokenModel } from "./model/TestApiTokenModel";
import { InMemoryApiTokenRepository } from "./repository/InMemoryApiTokenRepository";
import { InMemoryUserRepository } from "./repository/InMemoryUserRepository";


const mockAclConfig: IAclConfig = {
    roles: [],
    groups: [],
    defaultGroup: 'default'
};

const mockAuthConfig: IAuthConfig = {
    drivers: {
        "jwt": {
            name: 'jwt',
            options: {
                secret: 'test-secret',
                expiresInMinutes: 60,
                factory: {
                    user: TestUserFactory,
                    apiToken: TestApiTokenFactory
                },
                repository: {
                    user: InMemoryUserRepository,
                    apiToken: InMemoryApiTokenRepository
                }
            }
        }
    }
};


describe("AuthService", () => {
    let authService: AuthService;
    let userRepository: IUserRepository;
    let apiTokenRepository: IApiTokenRepository;
    let userFactory: IUserFactory;
    let apiTokenFactory: IApiTokenFactory;
    let jwt: IJwtAuthService;

    beforeEach(async () => {
        jest.clearAllMocks();

        authService = new AuthService(mockAuthConfig, mockAclConfig);
        await authService.boot();

        jwt = authService.getJwt();

        userRepository = authService.getUserRepository();
        apiTokenRepository = authService.getApiTokenRepository();

        userFactory = jwt.getUserFactory();
        apiTokenFactory = jwt.getApiTokenFactory();
    });

    describe("repositories", () => {

        test("should return the user repository", () => {
            expect(userRepository).toBeInstanceOf(InMemoryUserRepository);
        });

        test("should return the api token repository", () => {
            expect(apiTokenRepository).toBeInstanceOf(InMemoryApiTokenRepository);
        });

        test("should create and return a user", async () => {
            const user = await userRepository.create({
                id: '1',
                email: 'test@test.com',
                hashedPassword: 'password',
                aclRoles: [],
                aclGroups: []
            });
            const foundUser = await userRepository.findById(user.getId());

            expect(foundUser).toBeDefined();
            expect(foundUser?.getEmail()).toBe('test@test.com');
            expect(foundUser?.getHashedPassword()).toBe('password');
        });

        test("should create and return a api token", async () => {
            const apiToken = await apiTokenRepository.create({
                id: '1',
                userId: '1',
                token: 'token',
                scopes: [],
                options: {},
                revokedAt: null,
                expiresAt: null
            });
            const foundApiToken = await apiTokenRepository.findOneActiveToken(apiToken.getToken());

            expect(foundApiToken).toBeDefined();
            expect(foundApiToken?.getToken()).toBe('token');
            expect(foundApiToken?.getUserId()).toBe('1');
            expect(foundApiToken?.getScopes()).toEqual([]);
            expect(foundApiToken?.getOptions()).toEqual({});
        })
    });

    describe("factory", () => {
        test("should return the user factory", () => {
            expect(userFactory).toBeInstanceOf(TestUserFactory);
        });

        test("should create and return a user", async () => {
            const user = userFactory.create({
                email: 'test@test.com',
                hashedPassword: 'password',
                aclRoles: [],
                aclGroups: []
            });
            expect(user).toBeDefined();
            expect(user?.getEmail()).toBe('test@test.com');
            expect(user?.getHashedPassword()).toBe('password');
        });

        test("should return the api token factory", () => {
            expect(apiTokenFactory).toBeInstanceOf(TestApiTokenFactory);
        });

        test("should create and return a api token", async () => {
            const apiToken = apiTokenFactory.create({
                token: 'token',
                scopes: [],
                options: {}
            });
        });
    });

    describe("attemptCredentials", () => {
        test("should return a user", async () => {
            await userRepository.create(
                {
                    id: '1',
                    email: 'test@test.com',
                    hashedPassword: await jwt.hashPassword('password'),
                    aclRoles: [],
                    aclGroups: [],
                }
            )

            const jwtToken = await jwt.attemptCredentials('test@test.com', 'password');

            expect(typeof jwtToken).toBe('string');
            expect(jwtToken.length).toBeGreaterThan(0);
        });

        test("should throw an error with invalid credentials", async () => {
            await userRepository.create(
                {
                    id: '1',
                    email: 'test@test.com',
                    hashedPassword: await jwt.hashPassword('password'),
                    aclRoles: [],
                    aclGroups: [],
                }
            )

            await expect(jwt.attemptCredentials('test@test.com', 'invalid')).rejects.toThrow('Unauthorized');
        });
    });

    describe("attemptAuthenticateToken", () => {
        test("should return a user", async () => {
            await userRepository.create(
                {
                    id: '1',
                    email: 'test@test.com',
                    hashedPassword: await jwt.hashPassword('password'),
                    aclRoles: [],
                    aclGroups: [],
                }
            )
            const jwtToken = await jwt.attemptCredentials('test@test.com', 'password');
            const apiToken = await jwt.attemptAuthenticateToken(jwtToken);

            expect(apiToken).toBeDefined();
            expect(apiToken?.getUserId()).toBe('1');
            expect(apiToken?.getScopes()).toEqual([]);
            expect(apiToken?.getOptions()).toEqual({});
        });

        test('should throw an error if provided ill formed token', async () => {
            await expect(jwt.attemptAuthenticateToken('invalid')).rejects.toThrow(UnauthorizedException);
        });

        test("should return null if token is invalid", async () => {
            await expect(jwt.attemptAuthenticateToken('invalid')).rejects.toThrow(UnauthorizedException);
        });

        test("should return null if token is revoked", async () => {
            await userRepository.create(
                {
                    id: '1',
                    email: 'test@test.com',
                    hashedPassword: await jwt.hashPassword('password'),
                    aclRoles: [],
                    aclGroups: [],
                }
            )
            const jwtToken = await jwt.attemptCredentials('test@test.com', 'password');
            const apiToken = await jwt.attemptAuthenticateToken(jwtToken);

            expect(apiToken).toBeInstanceOf(TestApiTokenModel);

            await apiTokenRepository.revokeToken(apiToken as TestApiTokenModel);

            expect(await jwt.attemptAuthenticateToken(jwtToken)).toBeNull();
        });

        test("should return null if token is expired", async () => {
            const dateInPast = new Date(Date.now() - 1000);

            await userRepository.create(
                {
                    id: '1',
                    email: 'test@test.com',
                    hashedPassword: await jwt.hashPassword('password'),
                    aclRoles: [],
                    aclGroups: [],
                }
            )
            const jwtToken = await jwt.attemptCredentials('test@test.com', 'password');
            const apiToken = await jwt.attemptAuthenticateToken(jwtToken);

            expect(apiToken).toBeInstanceOf(TestApiTokenModel);

            await (apiTokenRepository as InMemoryApiTokenRepository).update('id', apiToken?.getId(), {
                expiresAt: dateInPast
            });

            expect(await jwt.attemptAuthenticateToken(jwtToken)).toBeNull();
        });

    });

    describe("createJwtFromUser", () => {
        test("should create a jwt token from a user", async () => {
            const user = await userRepository.create({
                id: '1',
                email: 'test@test.com',
                hashedPassword: await jwt.hashPassword('password'),
                aclRoles: [],
                aclGroups: [],
            });

            const jwtToken = await jwt.createJwtFromUser(user);

            expect(typeof jwtToken).toBe('string');
            expect(jwtToken.length).toBeGreaterThan(0);
        });
    });

    describe("refreshToken", () => {
        test("should refresh a jwt token", async () => {
            const user = await userRepository.create({
                id: '1',
                email: 'test@test.com',
                hashedPassword: await jwt.hashPassword('password'),
                aclRoles: [],
                aclGroups: [],
            });

            const jwtToken = await jwt.attemptCredentials('test@test.com', 'password');
            const apiToken = await jwt.attemptAuthenticateToken(jwtToken);

            // Change token to make the refreshed token different
            await (apiTokenRepository as InMemoryApiTokenRepository).update('id', apiToken?.getId(), {
                token: 'new-token'
            });

            const refreshedJwtToken = jwt.refreshToken(apiToken as TestApiTokenModel);
            
            expect(refreshedJwtToken).toBeDefined();
            expect(refreshedJwtToken.length).toBeGreaterThan(0);
            expect(refreshedJwtToken).not.toBe(jwtToken);
        });
    });

    describe("revokeToken", () => {
        test("should revoke a jwt token", async () => {
            await userRepository.create({
                id: '1',
                email: 'test@test.com',
                hashedPassword: await jwt.hashPassword('password'),
                aclRoles: [],
                aclGroups: [],
            });

            const jwtToken = await jwt.attemptCredentials('test@test.com', 'password');
            const apiToken = await jwt.attemptAuthenticateToken(jwtToken);

            expect(apiToken?.getRevokedAt()).toBeNull();

            await jwt.revokeToken(apiToken as TestApiTokenModel);

            expect(apiToken?.getRevokedAt()).toBeDefined();
            expect(apiToken?.getRevokedAt()).toBeInstanceOf(Date);
        });
    });

    describe("revokeAllTokens", () => {
        test("should revoke all tokens for a user", async () => {
            await userRepository.create({
                id: '1',
                email: 'test@test.com',
                hashedPassword: await jwt.hashPassword('password'),
                aclRoles: [],
                aclGroups: [],
            });

            const jwtToken = await jwt.attemptCredentials('test@test.com', 'password');
            const apiToken = await jwt.attemptAuthenticateToken(jwtToken);
            const apiTokenId = apiToken?.getId();
            const apiToken2 = await jwt.attemptAuthenticateToken(jwtToken);
            const apiToken2Id = apiToken2?.getId();

            expect(apiToken?.getRevokedAt()).toBeNull();
            expect(apiToken2?.getRevokedAt()).toBeNull();

            await jwt.revokeAllTokens(apiToken?.getUserId() as string);

            const refreshedApiToken = await (apiTokenRepository as InMemoryApiTokenRepository).findById(apiTokenId as string); 
            const refreshedApiToken2 = await (apiTokenRepository as InMemoryApiTokenRepository).findById(apiToken2Id as string);

            expect(refreshedApiToken?.getRevokedAt()).toBeDefined();
            expect(refreshedApiToken2?.getRevokedAt()).toBeDefined();
        });
    });
});
