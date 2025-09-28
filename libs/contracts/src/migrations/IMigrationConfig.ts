import { ModelConstructor } from "../../../../../../../../dist/database/model/model.t.js";

export interface IMigrationConfig
{
    schemaMigrationDir?: string;
    seederMigrationDir?: string;
    keepProcessAlive?: boolean;
    modelCtor?: ModelConstructor;
}