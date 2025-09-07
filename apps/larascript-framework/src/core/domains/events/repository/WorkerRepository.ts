import { queryBuilder } from "@/core/services/QueryBuilder.js";
import { IWorkerModel, IWorkerRepository } from "@larascript-framework/larascript-events";
import WorkerModel from "../models/WorkerModel.js";

export class WorkerRepository implements IWorkerRepository {

    async getFailedWorkers(): Promise<IWorkerModel[]> {
        return await queryBuilder(WorkerModel)
            .whereNotNull(WorkerModel.FAILED_AT)
            .orderBy(WorkerModel.CREATED_AT, 'asc')
            .get() as unknown as IWorkerModel[];
    }
    
    async getWorkers(): Promise<IWorkerModel[]> {
        return await queryBuilder(WorkerModel)
            .orderBy(WorkerModel.CREATED_AT, 'asc')
            .get() as unknown as IWorkerModel[];
    }

}