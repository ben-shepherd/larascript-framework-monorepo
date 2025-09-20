import BaseMakeFileCommand from "../base/BaseMakeFileCommand.js";

export default class MakeRouteResourceCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:route-resource',
            description: 'Create a new route resource',
            makeType: 'RouteResource',
            args: ['name'],
            endsWith: 'RouteResource',
            startWithLowercase: true
        })
    }

}