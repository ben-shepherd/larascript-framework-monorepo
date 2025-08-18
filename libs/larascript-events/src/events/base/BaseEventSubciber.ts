import { IBaseSubscriber } from "../interfaces";
import BaseEvent from "./BaseEvent";

class BaseEventSubscriber<TPayload = unknown> extends BaseEvent<TPayload> implements IBaseSubscriber<TPayload> {
    type: 'subscriber' = 'subscriber';
}

export default BaseEventSubscriber