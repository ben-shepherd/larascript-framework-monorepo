import DatabaseConnectionException from "@/database/exceptions/DatabaseConnectionException";
import { IDatabaseConfig } from "@/database/interfaces/config.t";
import DatabaseService from "@/database/services/DatabaseService";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { MockSQLAdapter } from "./database/mocks/MockSQLAdapter";

process.on('unhandledRejection', (reason) => {
    console.log(reason); // log the reason including the stack trace
    throw reason;
});

describe("Database Service", () => {
    const DEFAULT_CONNECTION = 'default'
    const MOCK_SQL_OPTIONS: ReturnType<MockSQLAdapter['getConfig']> = {
        connectionString: 'sql://user:pass@localhost:3306/db'
    }

    let databaseService: DatabaseService
    let defaultConfig: IDatabaseConfig = {
        defaultConnectionName: DEFAULT_CONNECTION,
        keepAliveConnections: '',
    }

    beforeEach(() => {
        databaseService = new DatabaseService(defaultConfig)
    });

    describe("getConfig", () => {
        test("should return the config", () => {
            const config = databaseService.getConfig()

            expect(config).toBeDefined()
            expect(config.defaultConnectionName).toBe(DEFAULT_CONNECTION)
            expect(config.keepAliveConnections).toBe('')
        })
    });

    describe("connectionConfig", () => {
        test("should add a connection", () => {
            databaseService.addConnection('sql', MockSQLAdapter, MOCK_SQL_OPTIONS)

            expect(databaseService.getConnectionConfig('sql')).toBeDefined()
            expect(databaseService.getConnectionConfig('sql').connectionString).toBe('sql://user:pass@localhost:3306/db')
            expect(databaseService.getAdapter('sql')).toBeInstanceOf(MockSQLAdapter)
        })

        test("should return default connection", () => {
            expect(databaseService.getDefaultConnectionName()).toBe(DEFAULT_CONNECTION)
        })

        test("should override connection name and return override value", () => {
            databaseService.setDefaultConnectionName('change')

            expect(databaseService.getDefaultConnectionName()).toBe('change')
        })
    });

    describe("adapters", () => {
        test("should return expected adapter", () => {
            databaseService.addConnection(DEFAULT_CONNECTION, MockSQLAdapter, MOCK_SQL_OPTIONS)

            const adapter = databaseService.getAdapter(DEFAULT_CONNECTION)

            expect(adapter).toBeInstanceOf(MockSQLAdapter)
        })

        test("should throw an error for adapter that doesn't exist", () => {
            databaseService.addConnection(DEFAULT_CONNECTION, MockSQLAdapter, MOCK_SQL_OPTIONS)

            expect(() => databaseService.getAdapter('bad-adapter')).toThrow('Adapter not found: bad-adapter')
        })
    })

    describe("boot", () => {

        test("should fail when no connection is added", async () => {
            await expect(databaseService.boot()).rejects.toThrow(DatabaseConnectionException)
        })

        test("should connect to the default connection", async () => {
            databaseService.addConnection(DEFAULT_CONNECTION, MockSQLAdapter, {
                connectionString: 'sql://user:pass@localhost:3306/db'
            })

            jest.spyOn(databaseService, 'connectDefault').mockImplementation(() => Promise.resolve())

            await databaseService.boot()

            expect(databaseService.connectDefault).toHaveBeenCalled()
        })

        test("should not connect to the default connection if onBootConnect is false", async () => {
            const databaseService = new DatabaseService({
                ...defaultConfig,
                onBootConnect: false
            })

            jest.spyOn(databaseService, 'connectDefault').mockImplementation(() => Promise.resolve())

            await databaseService.boot()

            expect(databaseService.connectDefault).not.toHaveBeenCalled()
        })

        test("should connect keep alive with other connections defined", async () => {
            const databaseService = new DatabaseService({
                ...defaultConfig,
                keepAliveConnections: 'other',
            })

            jest.spyOn(databaseService, 'connectDefault').mockImplementation(() => Promise.resolve())
            jest.spyOn(databaseService, 'connectAdapter').mockImplementation(() => Promise.resolve())

            await databaseService.boot()

            expect(databaseService.connectAdapter).toHaveBeenCalledWith('other')
        })

        test("should throw an error on connect keep alive with missing connection", async () => {
            const databaseService = new DatabaseService({
                ...defaultConfig,
                keepAliveConnections: 'other',
            })

            jest.spyOn(databaseService, 'connectDefault').mockImplementation(() => Promise.resolve())

            await expect(databaseService.boot()).rejects.toThrow(DatabaseConnectionException)
        })
    })

});
