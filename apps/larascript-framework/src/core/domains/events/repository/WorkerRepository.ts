import { IWorkerModel, IWorkerRepository } from "@larascript-framework/larascript-events";
import { queryBuilder } from "../../eloquent/services/EloquentQueryBuilderService";
import WorkerModel from "../models/WorkerModel";

export class WorkerRepository implements IWorkerRepository {
    
    async getWorkers(): Promise<IWorkerModel[]> {
        return await queryBuilder(WorkerModel)
            .orderBy(WorkerModel.CREATED_AT, 'asc')
            .get() as unknown as IWorkerModel[];
    }

}