import User from "@/models/User.js";
import AuthenticationUserRepository from "@/repository/AuthenticationUserRepository.js";


export default class UserRepository extends AuthenticationUserRepository<User> {
    constructor() {
        super(User)
    }
}