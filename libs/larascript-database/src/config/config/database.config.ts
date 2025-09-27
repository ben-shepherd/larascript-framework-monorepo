import { DatabaseConfig, IDatabaseConfig } from "@larascript-framework/larascript-database";

export const databaseConfig: IDatabaseConfig = {
    defaultConnectionName: "postgres",
    keepAliveConnections: "",
    connections: [
        DatabaseConfig.postgres("postgres", {
            uri: "postgres://root:example@localhost:5432/app",
            options: {},
        }),
        // TODO: Add MongoDB connection
    ],
}