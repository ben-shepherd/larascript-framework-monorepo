import User from "@/models/User.js"
import { TestAuthEnvironment } from "@/test-auth/TestAuthEnvironment.js"
import { DataTypes } from "sequelize"

export const resetUserTable = async () => {
    const schema = TestAuthEnvironment.getInstance().databaseService.schema()
    const table = User.getTable()

    if(await schema.tableExists(table)) {
        await schema.dropTable(table)
    }

    await schema.createTable(table, {
        // Include required fields for authentication
        email: DataTypes.STRING,
        hashedPassword: DataTypes.STRING,

        // ACL fields
        aclRoles: DataTypes.JSON,
        aclGroups: DataTypes.JSON,

        // User fields
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE

    })
}