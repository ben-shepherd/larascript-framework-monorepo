import BaseMakeFileCommand from "@/core/domains/make/base/BaseMakeFileCommand.js";

export default class MakeRoutesCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:routes',
            description: 'Create a new routing file',
            makeType: 'Routes',
            args: ['name'],
            endsWith: 'Routes',
            startWithLowercase: true
        })
    }

}