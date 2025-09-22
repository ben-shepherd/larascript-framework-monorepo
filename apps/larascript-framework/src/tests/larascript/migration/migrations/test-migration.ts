import { app } from "@/core/services/App.js";
import { BaseMigration } from "@larascript-framework/larascript-database";
import { DataTypes } from "sequelize";

class TestMigration extends BaseMigration {

    group?: string = 'testing';

    async up(): Promise<void> {
        await app('db').schema().createTable('tests', {
            name: DataTypes.STRING,
            age: DataTypes.INTEGER
        })
    }

    async down(): Promise<void> {
        await app('db').schema().dropTable('tests')
    }

}

export default TestMigration