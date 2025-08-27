import DB from "@/database/services/DB";
import BelongsTo from "@/eloquent/relational/BelongsTo";
import { IModelAttributes } from "@/model";
import Model from "@/model/base/Model";
import { testHelper } from "@/tests/tests-helper/testHelper";
import { DataTypes } from "sequelize";
import TestDepartmentModel from "./TestDepartmentModel";

const tableName = Model.formatTableName("testsEmployees");

export interface ITestEmployeeModelData extends IModelAttributes {
  id: string;
  name: string;
  type: string;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const resetTableEmployeeModel = async (
  connections: string[] = testHelper.getTestConnectionNames(),
) => {
  for (const connectionName of connections) {
    const schema = DB.getInstance()
      .databaseService()
      .getAdapter(connectionName)
      .getSchema();

    if (await schema.tableExists(tableName)) {
      await schema.dropTable(tableName);
    }

    await schema.createTable(tableName, {
      deptId: { type: DataTypes.UUID, allowNull: true },
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      salary: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  }
};

export default class TestPhysicalAssetModel extends Model<ITestEmployeeModelData> {
  table = tableName;

  public fields: string[] = [
    "deptId",
    "name",
    "salary",
    "createdAt",
    "updatedAt",
  ];

  relationships = ["department"];

  department(): BelongsTo {
    return this.belongsTo<TestDepartmentModel>(TestDepartmentModel, {
      localKey: "deptId",
    });
  }
}
