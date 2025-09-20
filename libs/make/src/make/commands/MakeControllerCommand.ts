import BaseMakeFileCommand from "../base/BaseMakeFileCommand.js";

export default class MakeController extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:controller',
            description: 'Create a new controller',
            makeType: 'Controller',
            args: ['name'],
            endsWith: 'Controller',
            startWithLowercase: false
        })

    }

}