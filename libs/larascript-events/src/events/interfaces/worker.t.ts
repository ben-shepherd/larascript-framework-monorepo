import { TSerializableValues } from "./event.t";

export interface IWorkerRepository {
    getWorkers(): Promise<IWorkerModel[]>;
}

export interface IWorkerCreatorConstructor {
    new (): IWorkerCreator;
}

export interface IWorkerCreator {
    createWorkerModel(data: IWorkerAttributes): IWorkerModel;
    createFailedWorkerModel(data: IWorkerAttributes): IWorkerModel;
}

export interface IWorkerModel  {
    setWorkerData(data: IWorkerAttributes): void;
    getWorkerData<T extends IWorkerAttributes = IWorkerAttributes>(): T | null;
    createWorkerData(data: IWorkerAttributes): Promise<void>;
    saveWorkerData(): Promise<void>;
    updateWorkerData(data: IWorkerAttributes): Promise<void>;
    deleteWorkerData(): Promise<boolean>;
}

export interface IWorkerAttributes {
    payload: TSerializableValues | null;
    attempts: number;
    retries: number;
    queueName: string;
    eventName: string;
    error?: string;
    failedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export type TEventWorkerOptions = {
    queueName: string;
    retries: number;
    runAfterSeconds: number;
    runOnce?: boolean;
    workerCreator: IWorkerCreatorConstructor;
}