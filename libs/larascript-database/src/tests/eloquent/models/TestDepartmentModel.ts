import DB from "@/database/services/DB";
import HasMany from "@/eloquent/relational/HasMany";
import { IModelAttributes } from "@/model";
import Model from "@/model/base/Model";
import { testHelper } from "@/tests/tests-helper/testHelper";
import { Collection } from "@larascript-framework/larascript-collection";
import { DataTypes } from "sequelize";
import TestEmployeeModel from "./TestEmployeeModel";

const tableName = Model.formatTableName('testsDepartments')

export interface ITestDepartmentModelData extends IModelAttributes {
    deptId: string;
    deptName: string;
    createdAt: Date;
    updatedAt: Date;
    employees?: Collection<TestEmployeeModel>;

}

export const resetTableDepartmentModel = async (connections: string[] = testHelper.getTestConnectionNames()) => {
    for (const connectionName of connections) {
        const schema = DB.getInstance().databaseService().getAdapter(connectionName).getSchema();

        if (await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }

        await schema.createTable(tableName, {
            deptName: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }
}

export default class TestDepartmentModel extends Model<ITestDepartmentModelData> {

    table = tableName

    public fields: string[] = [
        'deptName',
        'createdAt',
        'updatedAt'
    ];

    public relationships: string[] = [
        'employees'
    ]

    employees(): HasMany {
        return this.hasMany(TestEmployeeModel, { foreignKey: 'deptId', localKey: 'id' });
    }

}