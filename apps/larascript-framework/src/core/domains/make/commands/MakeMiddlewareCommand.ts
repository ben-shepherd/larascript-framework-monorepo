import BaseMakeFileCommand from "@/core/domains/make/base/BaseMakeFileCommand.js";

export default class MakeMiddlewareCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:middleware',
            description: 'Create a new middleware',
            makeType: 'Middleware',
            args: ['name'],
            endsWith: 'Middleware',
            startWithLowercase: false
        })
    }

}