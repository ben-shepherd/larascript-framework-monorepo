import { IModel, ModelConstructor } from "@larascript-framework/larascript-database";
import { MigrationType } from "@src/core/domains/migrations/interfaces/IMigration";
import MigrationModel from "@src/core/domains/migrations/models/MigrationModel";


type Props = {
    name: string;
    batch: number;
    checksum: string;
    type: MigrationType;
    appliedAt: Date;
}

class MigrationFactory {

    /**
     * Create a migration model
     * @param param
     * @returns 
     */
    create({ name, batch, checksum, type, appliedAt }: Props, modelCtor: ModelConstructor = MigrationModel): IModel {
        return new modelCtor({
            name,
            batch,
            checksum,
            type,
            appliedAt
        });
    }

}

export default MigrationFactory