import WorkerModel, { WorkerModelAttributes } from "@/core/domains/events/models/WorkerModel.js";

export default class TestWorkerModel extends WorkerModel {

    table = 'testsWorker'

    constructor(data: WorkerModelAttributes | null = null) {
        super(data ?? {} as WorkerModelAttributes)
    }

}