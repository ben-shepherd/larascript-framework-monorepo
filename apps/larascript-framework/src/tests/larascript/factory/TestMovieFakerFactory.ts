import { BaseFactory } from "@larascript-framework/larascript-core";
import { TestMovieModel } from "@src/tests/larascript/models/models/TestMovie";

class TestMovieFactory extends BaseFactory<TestMovieModel> {

    getDefinition(): TestMovieModel['attributes'] {
        return {
            authorId: this.faker.number.int({ min: 1, max: 100 }).toString(),
            name: this.faker.person.fullName(),
            yearReleased: this.faker.number.int({ min: 1900, max: 2000 }),
            createdAt: this.faker.date.past(),
            updatedAt: this.faker.date.recent()
        }
    }

}

export default TestMovieFactory