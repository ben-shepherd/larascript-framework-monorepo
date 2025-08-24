import { BaseFactory } from '@larascript-framework/larascript-core';
import TestUser from '@src/tests/larascript/models/models/TestUser';

export default class TestUserFactory extends BaseFactory<TestUser> {

    getDefinition(): TestUser['attributes'] {
        return {
            id: this.faker.string.uuid(),
            email: this.faker.internet.email(),
            hashedPassword: this.faker.string.uuid(),
            roles: [],
            groups: [],
            createdAt: this.faker.date.past(),
            updatedAt: this.faker.date.recent(),
        }
    }
    
}
