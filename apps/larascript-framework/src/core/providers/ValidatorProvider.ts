import { validatorFn } from "@/core/domains/validator/service/validatorFn.js";
import { BaseProvider } from "@larascript-framework/larascript-core";
import { ValidatorServices } from "@larascript-framework/larascript-validator";
import { app } from "../services/App.js";

class ValidatorProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering ValidatorProvider');

        // Initialize the validator dependencies
        ValidatorServices.init({
            queryBuilder: app('query'),
            database: app('db'),
        });

        // Bind a helper function for on the fly validation
        this.bind('validatorFn', validatorFn);

    }

}

export default ValidatorProvider