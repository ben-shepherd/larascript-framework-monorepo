import BaseMakeFileCommand from "@/core/domains/make/base/BaseMakeFileCommand.js";

export default class MakeValidatorCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:validator',
            description: 'Create a validator',
            makeType: 'Validator',
            args: ['name'],
            endsWith: 'Validator',
            startWithLowercase: false
        })
    }

}