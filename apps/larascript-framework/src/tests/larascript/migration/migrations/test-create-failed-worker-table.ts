import FailedWorkerModel from "@/core/domains/events/models/FailedWorkerModel.js";
import BaseMigration from "@/core/domains/migrations/base/BaseMigration.js";
import { DataTypes } from "sequelize";

export class CreateFailedWorkerTableMigration extends BaseMigration {

    // Specify the database provider if this migration should run on a particular database.
    // Uncomment and set to 'mongodb', 'postgres', or another supported provider.
    // If left commented out, the migration will run only on the default provider.
    // databaseProvider: 'mongodb' | 'postgres' = 'postgres';

    group?: string = 'testing';

    table = FailedWorkerModel.getTable();

    async up(): Promise<void> {
        await this.schema.createTable(this.table, {
            eventName: DataTypes.STRING,
            payload: DataTypes.JSON,
            error: DataTypes.STRING,
            createdAt: DataTypes.DATE
        })
    }

    async down(): Promise<void> {
        await this.schema.dropTable(this.table)
    }

}