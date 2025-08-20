import { EventRegistry } from "@larascript-framework/larascript-events";
import { BaseEventSubscriber } from "@larascript-framework/larascript-events/dist/events/base/BaseEventSubciber";

class UserCreatedSubscriber extends BaseEventSubscriber {

    protected namespace: string = 'auth';

    constructor(payload) {
        super(payload);
    }

    getQueueName(): string {
        return 'default';
    }

    async execute(): Promise<void> {
        // const payload = this.getPayload<IUserData>();
        
        // Handle logic
    }

}

export default EventRegistry.registerSubscriber(UserCreatedSubscriber);