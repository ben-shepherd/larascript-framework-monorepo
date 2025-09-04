import { IWorkerAttributes, IWorkerModel, IWorkerModelFactory } from "@/worker";
import FailedWorkerModel from "../models/FailedWorkerModel";
import WorkerModel, { WorkerModelAttributes } from "../models/WorkerModel";

/**
 * WorkerModelFactory class.
 * 
 * Factory class responsible for creating worker model instances.
 * Provides methods to create both regular worker models and failed worker models
 * with the appropriate data structures.
 * 
 * @class WorkerModelFactory
 * @implements IWorkerModelFactory
 */
export class WorkerModelFactory implements IWorkerModelFactory {

    createWorkerModel(data: IWorkerAttributes): IWorkerModel {
        return new WorkerModel(data as WorkerModelAttributes);
    }

    createFailedWorkerModel(data: IWorkerAttributes): IWorkerModel {
        return new FailedWorkerModel(data as WorkerModelAttributes);
    }

}