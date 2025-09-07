import User from "@/app/models/auth/User.js";
import AuthenticableUserFactory from "./AuthenticableUserFactory.js";

class UserFactory extends AuthenticableUserFactory<User> {

    constructor() {
        super(User);
    }

    getDefinition(): NonNullable<User['attributes']> {
        return {
            // Include AuthenticableUser attributes
            ...super.getDefinition(),
            firstName: '',
            lastName: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            
        }
    }

}

export default UserFactory;
