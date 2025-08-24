import User from "@src/app/models/auth/User";
import AuthenticationUserRepository from "@src/app/repositories/auth/AuthenticationUserRepository";


export default class UserRepository extends AuthenticationUserRepository<User> {
    constructor() {
        super(User)
    }
}