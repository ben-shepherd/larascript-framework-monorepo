import { IAuthConfig } from '@larascript-framework/larascript-auth';
import { parseBooleanFromString } from '@larascript-framework/larascript-utils';
import ApiTokenFactory from '@src/app/factory/ApiTokenFactory';
import UserFactory from '@src/app/factory/UserFactory';
import ApiTokenRepository from '@src/app/repositories/auth/ApiTokenRepository';
import UserRepository from '@src/app/repositories/UserRepository';

export interface IExtendedAuthConfig extends IAuthConfig {
    http: {
        routes: {
            enabled: boolean,
            endpoints: {
                register: boolean,
                login: boolean,
                refresh: boolean,
                update: boolean,
                logout: boolean
            }
        }
    }
}

export const authConfig: IExtendedAuthConfig = {
    drivers: {
        jwt: {
            name: 'jwt',
            options: {
                secret: process.env.JWT_SECRET as string ?? '',
                expiresInMinutes: process.env.JWT_EXPIRES_IN_MINUTES ? parseInt(process.env.JWT_EXPIRES_IN_MINUTES) : 60,
                factory: {
                    user: UserFactory,
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
