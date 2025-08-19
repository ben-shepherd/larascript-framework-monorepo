import { IBaseListener, IEventListener } from "../interfaces";
import BaseEvent from "./BaseEvent";


class BaseEventListener<TPayload = unknown> extends BaseEvent<TPayload> implements IEventListener<TPayload>, IBaseListener<TPayload> {

    type: 'listener' = 'listener';

    /**
     * Constructor
     *
     * Creates a new instance of the event listener and dispatches the event to
     * all subscribers.
     *
     * @param payload The payload of the event to dispatch
     */
    constructor(payload?: TPayload, driverName?: string) {
        super(payload, driverName);
    }

}

export default BaseEventListener