import BaseMakeFileCommand from "@/core/domains/make/base/BaseMakeFileCommand.js";

export default class MakeObserverCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:observer',
            description: 'Create a new observer',
            makeType: 'Observer',
            args: ['name'],
            endsWith: 'Observer'
        })
    }

}