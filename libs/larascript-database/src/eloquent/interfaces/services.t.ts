import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IModel } from "../../model/index.js";
import { IEloquent } from "./eloquent.t.js";

export interface IEloquentQueryBuilderService {
  builder<Model extends IModel>(
    modelCtor: TClassConstructor<Model>,
    connectionName?: string,
  ): IEloquent<Model>;
}
