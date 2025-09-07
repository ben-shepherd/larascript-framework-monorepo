import AuthenticationUserRepository from "@/app/repositories/auth/AuthenticationUserRepository.js";
import TestUser from "@/tests/larascript/models/models/TestUser.js";
import { AuthenticableUserModel } from "@larascript-framework/larascript-auth";


export default class TestUserRepository extends AuthenticationUserRepository<AuthenticableUserModel> {

    constructor() {
        super(TestUser)
    }

}