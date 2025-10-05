import ApiTokenFactory from "@/app/factory/ApiTokenFactory.js";
import ApiTokenRepository from "@/app/repositories/auth/ApiTokenRepository.js";
import UserRepository from "@/app/repositories/UserRepository.js";
import { GROUPS, ROLES } from "@/config/acl.config.js";
import AuthProvider from "@/core/providers/AuthProvider.js";
import { IAuthRoutesConfig } from "@larascript-framework/contracts/auth";
import { IAclConfig } from "@larascript-framework/larascript-acl";
import { AuthenticableUserFactory } from "@larascript-framework/larascript-auth";
import { parseBooleanFromString } from "@larascript-framework/larascript-utils";


export default class TestAuthProvider extends AuthProvider {

    protected config: IAuthRoutesConfig = {
        drivers: {
            jwt: {
                name: 'jwt',
                options: {
                    secret: process.env.JWT_SECRET as string ?? '',
                    expiresInMinutes: process.env.JWT_EXPIRES_IN_MINUTES ? parseInt(process.env.JWT_EXPIRES_IN_MINUTES) : 60,
                    factory: {
                        user: AuthenticableUserFactory,
                        apiToken: ApiTokenFactory
                    },
                    repository: {
                        user: UserRepository,
                        apiToken: ApiTokenRepository
                    }
                }
            }
        },
        http: {
            routes: {
                enabled: parseBooleanFromString(process.env.ENABLE_AUTH_ROUTES, 'true'),
                endpoints: {
                    register: true,
                    login: true,
                    refresh: true,
                    update: true,
                    logout: true
                } 
            }
        }
    }

    protected aclConfig: IAclConfig = {

        // Default user group
        defaultGroup: GROUPS.USER,
    
        // List of groups
        groups: [
            {
                name: GROUPS.USER,
                roles: [ROLES.USER]
            },
            {
                name: GROUPS.ADMIN,
                roles: [ROLES.USER, ROLES.ADMIN]
            }
        ],
    
        // List of roles, scopes and other permissions
        roles: [
            {
                name: ROLES.ADMIN,
                scopes: []
            },
            {
                name: ROLES.USER,
                scopes: []
            },
        ],
    
    }
    
}
