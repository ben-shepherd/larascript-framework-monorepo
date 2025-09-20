import BaseMakeFileCommand from "../base/BaseMakeFileCommand.js";

export default class MakeEventCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:event',
            description: 'Create a new subscriber event',
            makeType: 'Subscriber',
            args: ['name'],
            endsWith: 'SubscriberEvent'
        })
    }

}