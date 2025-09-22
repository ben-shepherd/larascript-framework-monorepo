import User from "@/app/models/auth/User.js";
import { BaseMigration } from "@larascript-framework/larascript-database";
import { DataTypes } from "sequelize";

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