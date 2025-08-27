import DB from "@/database/services/DB";
import { IModelAttributes } from "@/model";
import Model from "@/model/base/Model";
import { forEveryConnection } from "@/tests/tests-helper/forEveryConnection";
import { TCastableType } from "@larascript-framework/larascript-utils";
import { DataTypes } from "sequelize";

const tableName = Model.formatTableName("testsEmails");

export interface ITestEmailModelData extends IModelAttributes {
  username: string;
  email: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const resetEmailTable = async () => {
  await forEveryConnection(async (connectionName) => {
    const schema = DB.getInstance()
      .databaseService()
      .getAdapter(connectionName)
      .getSchema();

    if (await schema.tableExists(tableName)) {
      await schema.dropTable(tableName);
    }

    await schema.createTable(tableName, {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  });
};

export default class TestEmailModel extends Model<ITestEmailModelData> {
  table = tableName;

  public fields: string[] = [
    "username",
    "email",
    "deletedAt",
    "createdAt",
    "updatedAt",
  ];

  public casts: Record<string, TCastableType> = {
    deletedAt: "date",
  };
}
