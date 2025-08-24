import { IAclConfig } from "@larascript-framework/larascript-acl";
import { parseBooleanFromString } from "@larascript-framework/larascript-utils";
import ApiTokenFactory from "@src/app/factory/ApiTokenFactory";
import AuthenticableUserFactory from "@src/app/factory/AuthenticableUserFactory";
import ApiTokenRepository from "@src/app/repositories/auth/ApiTokenRepository";
import UserRepository from "@src/app/repositories/UserRepository";
import { GROUPS, ROLES } from "@src/config/acl.config";
import { IExtendedAuthConfig } from "@src/config/auth.config";
import AuthProvider from "@src/core/providers/AuthProvider";


export default class TestAuthProvider extends AuthProvider {

    protected config: IExtendedAuthConfig = {
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
