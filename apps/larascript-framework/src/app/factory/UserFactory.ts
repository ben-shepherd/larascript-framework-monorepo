import User from "@/app/models/auth/User.js";
import { UserFactory as BaseUserFactory } from "@larascript-framework/larascript-auth";

class UserFactory extends BaseUserFactory {

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
