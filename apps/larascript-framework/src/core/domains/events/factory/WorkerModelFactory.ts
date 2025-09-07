import { IWorkerAttributes, IWorkerModel, IWorkerModelFactory } from "@larascript-framework/larascript-events";
import FailedWorkerModel from "../models/FailedWorkerModel.js";
import WorkerModel, { WorkerModelAttributes } from "../models/WorkerModel.js";

export class WorkerModelFactory implements IWorkerModelFactory {

    createWorkerModel(data: IWorkerAttributes): IWorkerModel {
        return new WorkerModel(data as WorkerModelAttributes);
    }

    createFailedWorkerModel(data: IWorkerAttributes): IWorkerModel {
        return new FailedWorkerModel(data as WorkerModelAttributes);
    }

}