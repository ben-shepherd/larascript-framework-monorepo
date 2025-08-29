import { describe, expect, test } from '@jest/globals';
import { AuthService } from '@larascript-framework/larascript-auth';
import { Kernel } from '@larascript-framework/larascript-core';
import { EloquentQueryBuilderService } from '@larascript-framework/larascript-database';
import DatabaseService from '@larascript-framework/larascript-database/dist/database/services/DatabaseService';
import { EventService } from '@larascript-framework/larascript-events';
import ConsoleService from '@src/core/domains/console/service/ConsoleService';
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