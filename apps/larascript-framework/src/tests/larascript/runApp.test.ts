import { describe, expect, test } from '@jest/globals';
import { Kernel } from '@larascript-framework/larascript-core';
import EventService from '@larascript-framework/larascript-events/dist/events/services/EventService';
import AuthService from '@src/core/domains/auth/services/AuthService';
import JwtAuthService from '@src/core/domains/auth/services/JwtAuthService';
import ConsoleService from '@src/core/domains/console/service/ConsoleService';
import Database from '@src/core/domains/database/services/Database';
import { app } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

describe('attempt to run app with normal appConfig', () => {

    /**
   * Boot kernel normally
   * Check containers have been set
   */
    test.concurrent('kernel boot', async () => {
        await testHelper.testBootApp()
        expect(app('events')).toBeInstanceOf(EventService);
        expect(app('db')).toBeInstanceOf(Database);
        expect(app('console')).toBeInstanceOf(ConsoleService);
        expect(app('auth')).toBeInstanceOf(AuthService);
        expect(app('auth.jwt')).toBeInstanceOf(JwtAuthService);
        /**
         * TODO: List all expected services here
         */
        expect(Kernel.getInstance(null).booted()).toBe(true);
    }, 10000)
});