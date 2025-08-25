import DatabaseConnectionException from "@/database/exceptions/DatabaseConnectionException";
import { IDatabaseConfig } from "@/database/interfaces/config.t";
import DatabaseConfig from "@/database/services/DatabaseConfig";
import DatabaseService from "@/database/services/DatabaseService";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { MockSQLAdapter, MockSQLConfig } from "./database/mocks/MockSQLAdapter";

process.on('unhandledRejection', (reason) => {
    console.log(reason); // log the reason including the stack trace
    throw reason;
});

describe("Database Service", () => {
    const DEFAULT_CONNECTION = 'sql'
    let databaseService: DatabaseService
    let defaultConfig: IDatabaseConfig = {
        defaultConnectionName: DEFAULT_CONNECTION,
        keepAliveConnections: '',
        connections: [
            DatabaseConfig.connection("sql", MockSQLAdapter, MockSQLConfig)
        ]
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
            databaseService.register()

            expect(databaseService.getConnectionConfig('sql')).toBeDefined()
            expect(databaseService.getConnectionConfig('sql').connectionString).toBe('sql://user:pass@localhost:3306/db')
            expect(databaseService.getAdapter('sql')).toBeInstanceOf(MockSQLAdapter)
        })

        test("should throw error if multiple conncetion names detected", async () => {
            const config: IDatabaseConfig = {
                defaultConnectionName: 'sql-1',
                keepAliveConnections: '',
                connections: [
                    DatabaseConfig.connection("sql-1", MockSQLAdapter, MockSQLConfig),
                    DatabaseConfig.connection("sql-1", MockSQLAdapter, MockSQLConfig),
                ]
            }

            databaseService = new DatabaseService(config)

            expect(() => databaseService.register()).toThrow('Connection \'sql-1\' already defined')
        })

        test("should create multiple connections with the same adapter", async () => {
            const config: IDatabaseConfig = {
                defaultConnectionName: 'sql-1',
                keepAliveConnections: '',
                connections: [
                    DatabaseConfig.connection("sql-1", MockSQLAdapter, MockSQLConfig),
                    DatabaseConfig.connection("sql-2", MockSQLAdapter, {
                        connectionString: 'sql://user:pass@localhost:3307/db'
                    }),
                ]
            }

            databaseService = new DatabaseService(config)
            databaseService.register()
        
            expect(databaseService.getAdapter('sql-1')).toBeInstanceOf(MockSQLAdapter)
            expect(databaseService.getAdapter<MockSQLAdapter>('sql-1').getConfig().connectionString).toBe(MockSQLConfig.connectionString)
            expect(databaseService.getAdapter('sql-2')).toBeInstanceOf(MockSQLAdapter)
            expect(databaseService.getAdapter<MockSQLAdapter>('sql-2').getConfig().connectionString).toBe('sql://user:pass@localhost:3307/db')
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
            databaseService.addConnection(DEFAULT_CONNECTION, MockSQLAdapter, MockSQLConfig)

            const adapter = databaseService.getAdapter(DEFAULT_CONNECTION)

            expect(adapter).toBeInstanceOf(MockSQLAdapter)
        })

        test("should throw an error for adapter that doesn't exist", () => {
            databaseService.addConnection(DEFAULT_CONNECTION, MockSQLAdapter, MockSQLConfig)

            expect(() => databaseService.getAdapter('bad-adapter')).toThrow('Adapter not found: bad-adapter')
        })

        test("should return true if an adapter is registered", () => {
            databaseService.register()

            expect(databaseService.isRegisteredAdapter(MockSQLAdapter)).toBeTruthy()
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
