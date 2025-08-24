import { IDatabaseAdapter } from "@/database/interfaces/adapter.t";
import { IPrepareOptions } from "@/database/interfaces/options.t";
import { IDatabaseSchema } from "@/database/interfaces/schema.t";
import { IEloquent } from "@/eloquent/interfaces/eloquent.t";
import { IRelationshipResolver } from "@/eloquent/interfaces/relationships.t";
import { IModel } from "@/model";
import { TClassConstructor } from "@larascript-framework/larascript-utils";

// Mock schema implementation
const MockSchema: IDatabaseSchema = {
    createDatabase: async (name: string) => {},
    databaseExists: async (name: string) => true,
    dropDatabase: async (name: string) => {},
    createTable: async (name: string, ...args: any[]) => {},
    dropTable: async (name: string, ...args: any[]) => {},
    tableExists: async (name: string) => true,
    alterTable: async (name: string, ...args: any[]) => {},
    dropAllTables: async () => {},
};

// Mock relationship resolver
const MockRelationshipResolver: IRelationshipResolver = {
    resolveData: async () => [],
    attachEloquentRelationship: () => ({} as IEloquent),
};

export const MockSQLConfig = {
    connectionString: 'sql://user:pass@localhost:3306/db'
}

export class MockSQLAdapter implements IDatabaseAdapter {

    getConfig(): typeof MockSQLConfig {
        return MockSQLConfig;
    }

    // Column normalization
    normalizeColumn(col: string): string {
        return col.toLowerCase();
    }
    
    // Connection management
    setConnectionName(...args: any[]): void {}
    
    getConnectionName(...args: any[]): string {
        return 'sql';
    }
    
    async connectDefault(): Promise<unknown> {
        return true;
    }
    
    async isConnected(): Promise<boolean> {
        return true;
    }
    
    async close(): Promise<void> {}
    
    // Schema operations
    getSchema(): IDatabaseSchema {
        return MockSchema;
    }
    
    async createMigrationSchema(...args: any[]): Promise<unknown> {
        return undefined;
    }
    
    // Eloquent and relationships
    getEloquentConstructor<Model extends IModel = IModel>(): TClassConstructor<IEloquent<Model>> {
        return (class MockEloquent {} as any);
    }
    
    getRelationshipResolver(connection: string): IRelationshipResolver {
        return MockRelationshipResolver;
    }
    
    // Configuration
    getDockerComposeFileName(): string {
        return 'docker-compose.sql.yml';
    }
    
    getDefaultCredentials(): string | null {
        return 'sql://user:pass@localhost:3306/db';
    }
    
    // Document preparation
    prepareDocument<T extends object = object>(document: T, prepareOptions?: IPrepareOptions): T {
        return document;
    }
}