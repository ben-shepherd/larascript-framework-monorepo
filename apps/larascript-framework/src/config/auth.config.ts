import ApiTokenFactory from '@/app/factory/ApiTokenFactory.js';
import UserFactory from '@/app/factory/UserFactory.js';
import ApiTokenRepository from '@/app/repositories/auth/ApiTokenRepository.js';
import UserRepository from '@/app/repositories/UserRepository.js';
import { IAuthConfig } from '@larascript-framework/larascript-auth';
import { parseBooleanFromString } from '@larascript-framework/larascript-utils';

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
