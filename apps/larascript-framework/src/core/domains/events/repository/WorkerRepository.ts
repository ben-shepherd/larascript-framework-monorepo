import { IWorkerModel, IWorkerRepository } from "@larascript-framework/larascript-events";
import { queryBuilder } from "@src/core/services/QueryBuilder";
import WorkerModel from "../models/WorkerModel";

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