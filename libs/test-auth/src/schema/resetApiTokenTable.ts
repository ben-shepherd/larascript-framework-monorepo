import ApiToken from "@/models/ApiToken.js"
import { TestAuthEnvironment } from "@/test-auth/TestAuthEnvironment.js"
import { DataTypes } from "sequelize"

export const resetApiTokenTable = async () => {
    const schema = TestAuthEnvironment.getInstance().databaseService.schema()
    const table = ApiToken.getTable()

    if(await schema.tableExists(table)) {
        await schema.dropTable(table)
    }

    await schema.createTable(table, {
        userId: DataTypes.STRING,
        token: DataTypes.STRING,
        scopes: DataTypes.JSON,
        options: DataTypes.JSON,
        revokedAt: DataTypes.DATE,
        expiresAt: DataTypes.DATE
    })
}