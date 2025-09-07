/* eslint-disable no-undef */
import { app } from '@/core/services/App.js';
import TestMigrationModel from '@/tests/larascript/migration/models/TestMigrationModel.js';
import TestApiTokenModel from '@/tests/larascript/models/models/TestApiTokenModel.js';
import TestModel from '@/tests/larascript/models/models/TestModel.js';
import TestUser from '@/tests/larascript/models/models/TestUser.js';
import testHelper from '@/tests/testHelper.js';
import { describe } from '@jest/globals';
import { IDatabaseSchema } from '@larascript-framework/larascript-database';

const dropAndCreateMigrationSchema = async () => {
    const migrationTable = new TestMigrationModel(null).table

    if (await app('db').schema().tableExists(migrationTable)) {
        await app('db').schema().dropTable(migrationTable);
    }

    await app('db').createMigrationSchema(migrationTable)
}

const dropTestSchema = async () => {
    if (await app('db').schema().tableExists('tests')) {
        await app('db').schema().dropTable('tests');
    }

}


describe('test migrations', () => {

    let schema: IDatabaseSchema;

    let tables: string[];

    beforeAll(async () => {
        await testHelper.testBootApp()

        tables = [
            TestApiTokenModel.getTable(),
            TestUser.getTable(),
            TestModel.getTable()
        ]

        console.log('Connection', app('db').getDefaultConnectionName())

        await dropAndCreateMigrationSchema()

        await dropTestSchema()

        schema = app('db').schema();
    });

    afterAll(async () => {
        await app('db').schema().dropTable('tests');
        await app('db').schema().dropTable('migrations');
    })

    test('test up migration', async () => {

        await app('console').readerService(['migrate:up', '--group=testing']).handle();

        for (const table of tables) {
            console.log('checking if table exists', table)
            const tableExists = await schema.tableExists(table);
            console.log('tableExists (expect: true)', table, tableExists)
            expect(tableExists).toBe(true);
        }
    });

    test('test down migration', async () => {

        await app('console').readerService(['migrate:down', '--group=testing']).handle();

        for (const table of tables) {
            const tableExists = await schema.tableExists(table);
            console.log('tableExists (expect: false)', table, tableExists)
            expect(tableExists).toBe(false);
        }

    });

});