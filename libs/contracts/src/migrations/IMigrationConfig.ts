import { ModelConstructor } from "@larascript-framework/larascript-database";

export interface IMigrationConfig
{
    schemaMigrationDir?: string;
    seederMigrationDir?: string;
    keepProcessAlive?: boolean;
    modelCtor?: ModelConstructor;
}