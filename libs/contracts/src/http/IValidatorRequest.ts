import { CustomValidatorConstructor } from "@/validator/IValidator.js";

export interface IValidatorRequest {
    validator?: CustomValidatorConstructor
}