import WorkerModel, { WorkerModelAttributes } from "@src/core/domains/events/models/WorkerModel";

export default class TestWorkerModel extends WorkerModel {

    table = 'testsWorker'

    constructor(data: WorkerModelAttributes | null = null) {
        super(data ?? {} as WorkerModelAttributes)
    }

}