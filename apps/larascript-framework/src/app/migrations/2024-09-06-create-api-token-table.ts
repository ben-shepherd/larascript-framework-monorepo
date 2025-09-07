import ApiToken from "@/app/models/auth/ApiToken.js";
import BaseMigration from "@/core/domains/migrations/base/BaseMigration.js";
import { DataTypes } from "sequelize";

export class CreateApiTokenMigration extends BaseMigration {

    group?: string = 'app:setup';

    async up(): Promise<void> {
        await this.schema.createTable(ApiToken.getTable(), {
            userId: DataTypes.STRING,
            token: DataTypes.STRING,
            scopes: DataTypes.JSON,
            options: DataTypes.JSON,
            revokedAt: DataTypes.DATE,
            expiresAt: DataTypes.DATE
        })
    }

    async down(): Promise<void> {
        await this.schema.dropTable(ApiToken.getTable());
    }

}