import { Observer } from "@larascript-framework/larascript-observer";
import { TestObserverModelData } from "@src/tests/larascript/models/models/TestObserverModel";

class TestObserver extends Observer<TestObserverModelData> {

    async creating(data: TestObserverModelData): Promise<TestObserverModelData> {
        data.number = 1;
        return data
    }

     
    onNameChange = (attributes: TestObserverModelData) => {
        attributes.name = 'Bob'
        return attributes;
    }

}

export default TestObserver