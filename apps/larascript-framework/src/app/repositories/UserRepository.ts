import User from "@/app/models/auth/User.js";
import AuthenticationUserRepository from "@/app/repositories/auth/AuthenticationUserRepository.js";


export default class UserRepository extends AuthenticationUserRepository<User> {
    constructor() {
        super(User)
    }
}