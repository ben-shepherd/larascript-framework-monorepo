import BaseMakeFileCommand from "@/core/domains/make/base/BaseMakeFileCommand.js";

export default class MakeModelCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:model',
            description: 'Create a new model',
            makeType: 'Model',
            endsWith: 'Model',
            args: ['name', 'collection'],
            argsOptional: ['collection'],
        })
    }

}