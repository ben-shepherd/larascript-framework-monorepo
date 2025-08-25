import { IDatabaseAdapter } from "@/database/interfaces/adapter.t";
import { IDatabaseService } from "@/database/interfaces/service.t";
import DatabaseAdapter from "@/database/services/DatabaseAdapter";
import { describe, expect, test } from "@jest/globals";
import { MockSQLAdapter } from "./database/mocks/MockSQLAdapter";

describe("Database Adapter", () => {

    test("getName", () => {
        expect(DatabaseAdapter.getName(MockSQLAdapter)).toBe('MockSQLAdapter')
    })

    test("getComposerFileNames", () => {
        
        const mockAdapter = class MockAdapter {
            getDockerComposeFileName(): string {
                return 'docker-compose.mongodb.yml'
            }
        } as unknown as IDatabaseAdapter

        const databaseService = jest.fn().mockImplementation((...args: any[]) => {
            return {
                getAllAdapterConstructors: jest.fn().mockImplementation((...args: any[]) => {
                    return [mockAdapter]
                }),
                getComposerFileNames: jest.fn().mockImplementation((...args: any[]) => {
                    return [{
                        fullName: 'docker-compose.mongodb.yml',
                        shortName: 'mongodb'
                    }
                ]
                })
            } as unknown as IDatabaseService
        }) as unknown as (() => IDatabaseService)

        const expected = [
            {
                fullName: 'docker-compose.mongodb.yml',
                shortName: 'mongodb'
            }
        ]

        expect(DatabaseAdapter.getComposerFileNames(databaseService())).toEqual(expected)
    })
});
