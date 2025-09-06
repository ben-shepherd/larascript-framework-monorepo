import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IModel } from "../../model";
import { IEloquent } from "./eloquent.t";

export interface IEloquentQueryBuilderService {
  builder<Model extends IModel>(
    modelCtor: TClassConstructor<Model>,
    connectionName?: string,
  ): IEloquent<Model>;
}
