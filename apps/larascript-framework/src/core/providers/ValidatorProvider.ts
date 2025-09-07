import { validatorFn } from "@/core/domains/validator/service/validatorFn.js";
import { BaseProvider } from "@larascript-framework/larascript-core";

class ValidatorProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering ValidatorProvider');

        // Bind a helper function for on the fly validation
        this.bind('validatorFn', validatorFn);

    }

}

export default ValidatorProvider