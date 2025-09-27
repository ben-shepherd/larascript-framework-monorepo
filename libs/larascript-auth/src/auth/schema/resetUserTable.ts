import { AuthEnvironment } from "@/environment/AuthEnvironment.js"
import User from "../models/User.js"
import { createUserTable } from "./createUserTable.js"

export const resetUserTable = async (additionalSchema: Record<string, unknown> = {}) => {
    const schema = AuthEnvironment.getInstance().databaseEnvironment.databaseService.schema()
    const table = User.getTable()

    if(await schema.tableExists(table)) {
        await schema.dropTable(table)
    }

    await createUserTable(additionalSchema)
}