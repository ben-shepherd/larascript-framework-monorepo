import { IWorkerAttributes, IWorkerModel, IWorkerModelFactory } from "@/worker";
import { generateUuidV4 } from "@larascript-framework/larascript-utils";
import TestFailedWorkerModel from "../models/TestFailedWorkerModel";
import TestWorkerModel from "../models/TestWorkerModel";

export class TestWorkerFactory implements IWorkerModelFactory {

    createWorkerModel(data: IWorkerAttributes): IWorkerModel {
        return new TestWorkerModel(data);
    }

    createFailedWorkerModel(data: IWorkerAttributes): IWorkerModel {
        if(!data.id) {
            data.id = generateUuidV4();
        }
        return new TestFailedWorkerModel(data);
    }
}