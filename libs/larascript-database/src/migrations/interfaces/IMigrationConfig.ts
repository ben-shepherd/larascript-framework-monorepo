import { ModelConstructor } from "@/model/interfaces/model.t.js";

export interface IMigrationConfig
{
    schemaMigrationDir?: string;
    seederMigrationDir?: string;
    keepProcessAlive?: boolean;
    modelCtor?: ModelConstructor;
}