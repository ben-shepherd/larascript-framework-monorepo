import { app } from '@/core/services/App.js';
import testHelper from '@/tests/testHelper.js';
import { describe, expect, test } from '@jest/globals';
import { AuthService } from '@larascript-framework/larascript-auth';
import { ConsoleService } from '@larascript-framework/larascript-console';
import { Kernel } from '@larascript-framework/larascript-core';
import { DatabaseService, EloquentQueryBuilderService } from '@larascript-framework/larascript-database';
import { EventService } from '@larascript-framework/larascript-events';

describe('attempt to run app with normal appConfig', () => {

    /**
   * Boot kernel normally
   * Check containers have been set
   */
    test.concurrent('kernel boot', async () => {
        await testHelper.testBootApp()
        expect(app('events')).toBeInstanceOf(EventService);
        expect(app('db')).toBeInstanceOf(DatabaseService);
        expect(app('query')).toBeInstanceOf(EloquentQueryBuilderService);
        expect(app('console')).toBeInstanceOf(ConsoleService);
        expect(app('auth')).toBeInstanceOf(AuthService);
        /**
         * TODO: List all expected services here
         */
        expect(Kernel.getInstance(null).booted()).toBe(true);
    }, 10000)
});