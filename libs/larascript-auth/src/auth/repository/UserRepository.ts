import User from "../models/User.js";
import AuthenticationUserRepository from "./AuthenticationUserRepository.js";


export default class UserRepository extends AuthenticationUserRepository<User> {
    constructor() {
        super(User)
    }
}