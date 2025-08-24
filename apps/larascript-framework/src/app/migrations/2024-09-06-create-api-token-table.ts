import ApiToken from "@src/app/models/auth/ApiToken";
import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
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