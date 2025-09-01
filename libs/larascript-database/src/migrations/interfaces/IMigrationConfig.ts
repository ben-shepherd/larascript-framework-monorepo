import { ModelConstructor } from "@/model";

export interface IMigrationConfig
{
    schemaMigrationDir?: string;
    seederMigrationDir?: string;
    keepProcessAlive?: boolean;
    modelCtor?: ModelConstructor;
}