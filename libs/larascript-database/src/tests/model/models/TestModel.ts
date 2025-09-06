import { IModelAttributes } from "@/index.js";
import Model from "@/model/base/Model.js";

export interface TestModelData extends IModelAttributes {
  name: string;
}

class TestModel extends Model<TestModelData> {
  public table: string = "tests";

  public fields: string[] = ["name", "createdAt", "updatedAt"];
}

export default TestModel;
