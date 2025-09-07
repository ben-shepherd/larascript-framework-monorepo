import BaseMakeFileCommand from "@/core/domains/make/base/BaseMakeFileCommand.js";

export default class MakeValidatorCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:factory',
            description: 'Create a factory',
            makeType: 'Factory',
            args: ['name'],
            endsWith: 'Factory',
            startWithLowercase: false
        })
    }

}