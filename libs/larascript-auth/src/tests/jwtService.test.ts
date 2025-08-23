import { IApiTokenFactory, IUserFactory } from "@/auth/interfaces/factory";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { IAclConfig } from "@larascript-framework/larascript-acl";
import {
    IApiTokenRepository,
    IAuthConfig,
    IUserRepository
} from "../auth/interfaces";
import AuthService from "../auth/services/AuthService";
import { TestApiTokenFactory } from "./factory/TestApiTokenFactory";
import { TestUserFactory } from "./factory/TestUserFactory";
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

    beforeEach(async () => {
        jest.clearAllMocks();

        authService = new AuthService(mockAuthConfig, mockAclConfig);
        await authService.boot();

        userRepository = authService.getUserRepository();
        apiTokenRepository = authService.getApiTokenRepository();
        
        userFactory = authService.getJwt().getUserFactory();
        apiTokenFactory = authService.getJwt().getApiTokenFactory();
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

});
