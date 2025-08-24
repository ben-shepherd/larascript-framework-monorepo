import { IFactory } from "@larascript-framework/larascript-core";
import { IModel, ModelConstructor } from "../domains/models/interfaces/IModel";

export type IModelFactory<Model extends IModel> = IFactory<Model>

export type IModelFactoryConstructor<Model extends IModel> = {
    new (modelConstructor: ModelConstructor<Model>): IModelFactory<Model>
}

