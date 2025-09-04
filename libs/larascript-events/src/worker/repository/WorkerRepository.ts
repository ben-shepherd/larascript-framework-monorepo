import { IWorkerModel, IWorkerRepository } from "@/worker";
import WorkerModel from "../models/WorkerModel";
import { WorkerServiceProvider } from "../services";

export class WorkerRepository implements IWorkerRepository {

    async getFailedWorkers(): Promise<IWorkerModel[]> {
        return await WorkerServiceProvider.eloquentQueryBuilder().builder(WorkerModel)
            .whereNotNull(WorkerModel.FAILED_AT)
            .orderBy(WorkerModel.CREATED_AT, 'asc')
            .get() as unknown as IWorkerModel[];
    }
    
    async getWorkers(): Promise<IWorkerModel[]> {
        return await WorkerServiceProvider.eloquentQueryBuilder().builder(WorkerModel)
            .orderBy(WorkerModel.CREATED_AT, 'asc')
            .get() as unknown as IWorkerModel[];
    }

}