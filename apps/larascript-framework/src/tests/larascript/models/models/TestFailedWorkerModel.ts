
import FailedWorkerModel from "@src/core/domains/events/models/FailedWorkerModel";
import { WorkerModelAttributes } from "@src/core/domains/events/models/WorkerModel";

export default class TestFailedWorkerModel extends FailedWorkerModel {

    public table: string = 'testsWorkerFailed'

    constructor(data: WorkerModelAttributes | null = null) {
        super(data ?? {} as WorkerModelAttributes)
    }

}