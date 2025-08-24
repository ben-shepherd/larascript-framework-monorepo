import User from "@src/app/models/auth/User";
import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
import DataTypes from "@src/core/domains/migrations/schema/DataTypes";

export class CreateUserModelMigration extends BaseMigration {

    group?: string = 'app:setup';

    async up(): Promise<void> {

        const stringNullable = {
            type: DataTypes.STRING,
            allowNull: true
        }

        await this.schema.createTable(User.getTable(), {

            // Include required fields for authentication
            email: DataTypes.STRING,
            hashedPassword: DataTypes.STRING,
            groups: DataTypes.JSON,
            roles: DataTypes.JSON,

            // User fields
            firstName: stringNullable,
            lastName: stringNullable,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE

        })
    }

    async down(): Promise<void> {
        await this.schema.dropTable(User.getTable());
    }

}