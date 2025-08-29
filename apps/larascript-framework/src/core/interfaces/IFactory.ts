/* eslint-disable no-unused-vars */
import { IModel } from "@larascript-framework/larascript-database";

export type FactoryConstructor<Model extends IModel> = {
    new (...args: any[]): IFactory<Model>
}

export default interface IFactory<Model extends IModel> {
    create(...args: any[]): Model;
    make(data?: Model['attributes']): Model;
    getDefinition(): Model['attributes'];

}