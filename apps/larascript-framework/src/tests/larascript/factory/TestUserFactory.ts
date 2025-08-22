import { ModelFactory } from '@src/core/base/ModelFactory';
import TestUser from '@src/tests/larascript/models/models/TestUser';

export default class TestUserFactory extends ModelFactory<TestUser> {

    protected modelConstructor = TestUser;
    
}
