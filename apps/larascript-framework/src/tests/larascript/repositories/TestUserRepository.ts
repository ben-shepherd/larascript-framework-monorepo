import { AuthenticableUserModel } from "@larascript-framework/larascript-auth";
import AuthenticationUserRepository from "@src/app/repositories/auth/AuthenticationUserRepository";
import TestUser from "@src/tests/larascript/models/models/TestUser";


export default class TestUserRepository extends AuthenticationUserRepository<AuthenticableUserModel> {

    constructor() {
        super(TestUser)
    }

}