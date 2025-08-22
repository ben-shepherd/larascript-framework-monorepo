import { BaseFactory } from "@larascript-framework/larascript-core";
import { IModel, ModelConstructor } from "../domains/models/interfaces/IModel";

export type IModelFactoryConstructor<Model extends IModel> = {
    new (modelConstructor: ModelConstructor<Model>): ModelFactory<Model>
}

export type IModelFactory<Model extends IModel> = ModelFactory<Model>

export abstract class ModelFactory<Model extends IModel> extends BaseFactory<Model> {

    protected modelConstructor!: ModelConstructor<Model>

    constructor(modelConstructor: ModelConstructor<Model>) {
        super();
        this.modelConstructor = modelConstructor;
    }

    getDefinition(): Model['attributes'] {
        return {} as Model['attributes']
    }

    create(data?: Model['attributes']): Model {
        if(typeof data === 'undefined') { 
            data = {}
        }

        return this.modelConstructor.create({
            ...this.getDefinition(),
            ...data
        });
    }
}
