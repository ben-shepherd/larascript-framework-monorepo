import User from "@src/app/models/auth/User";
import { GROUPS, ROLES } from "@src/config/acl.config";
import { ModelFactory } from "@src/core/base/ModelFactory";
import { cryptoService } from "@src/core/services/CryptoService";

class UserFactory extends ModelFactory<User> {

    getDefinition(): User['attributes'] | null {
        return {
            email: this.faker.internet.email(),
            hashedPassword: cryptoService().hash(this.faker.internet.password()),
            roles: [ROLES.USER],
            groups: [GROUPS.USER],
            firstName: this.faker.person.firstName(),
            lastName: this.faker.person.lastName(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }

}

export default UserFactory;
