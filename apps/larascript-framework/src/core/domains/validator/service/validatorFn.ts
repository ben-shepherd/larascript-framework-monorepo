import { IRulesObject, IValidatorFn, IValidatorMessages, Validator } from "@larascript-framework/larascript-validator";

/**
 * Short hand for creating a new validator on the fly
 */
export const validatorFn: IValidatorFn = (rules: IRulesObject, messages: IValidatorMessages = {}) => Validator.make(rules, messages);

