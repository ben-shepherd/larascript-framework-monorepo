import User from "@src/app/models/auth/User";
import AuthenticableUserFactory from "./AuthenticableUserFactory";

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
