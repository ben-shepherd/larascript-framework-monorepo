import FailedWorkerModel from "@/core/domains/events/models/FailedWorkerModel.js";
import { WorkerModelAttributes } from "@/core/domains/events/models/WorkerModel.js";

export default class TestFailedWorkerModel extends FailedWorkerModel {

    public table: string = 'testsWorkerFailed'

    constructor(data: WorkerModelAttributes | null = null) {
        super(data ?? {} as WorkerModelAttributes)
    }

}