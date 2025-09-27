import { AuthEnvironment } from "@/environment/AuthEnvironment.js"
import ApiToken from "../models/ApiToken.js"
import { createApiTokenTable } from "./createApiTokenTable.js"

export const resetApiTokenTable = async (additionalSchema: Record<string, unknown> = {}) => {
    const schema = AuthEnvironment.getInstance().databaseEnvironment.databaseService.schema()
    const table = ApiToken.getTable()

    if(await schema.tableExists(table)) {
        await schema.dropTable(table)
    }

    await createApiTokenTable(additionalSchema)
}