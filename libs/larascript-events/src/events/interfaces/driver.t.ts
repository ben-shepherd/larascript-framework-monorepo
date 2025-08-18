import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IDispatchable, INameable } from "./types.t";
import { IWorkerCreatorConstructor } from "./worker.t";

export interface IEventDriver extends INameable, IDispatchable {}

export interface IEventDriversConfigOption {
    driverCtor: TClassConstructor<IEventDriver>,
    options?: Record<string, unknown>;
}

export type TEventDriversRegister = Record<string, IEventDriversConfigOption>;

export interface IEventDriversConfig
{
    [key: string]: IEventDriversConfigOption
}

export interface IQueableDriverOptions {
    queueName: string;
    retries: number;
    failedCollection: string;
    runAfterSeconds: number;
    workerModelCtor: IWorkerCreatorConstructor;
}