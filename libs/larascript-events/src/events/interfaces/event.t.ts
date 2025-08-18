/* eslint-disable no-unused-vars */
import { IBaseEvent, IBaseListener, IBaseSubscriber } from "./base.t";
import { INameable } from "./types.t";

export interface EventConstructor {
    new (...args: any[]): IBaseEvent;
}

export interface ListenerConstructor {
    new (...args: any[]): IBaseListener;
}

export interface SubscriberConstructor {
    new (...args: any[]): IBaseSubscriber;
}


export interface IEventListener<TPayload = unknown> extends INameable, IBaseEvent<TPayload> {

}

export type TListenersConfigOption = {
    listener: ListenerConstructor;
    subscribers: SubscriberConstructor[]
}

export type TListenersMap = Map<string, TListenersConfigOption[]>

export type IEventListenersConfig = TListenersConfigOption[]

export type TSerializableValues = number | string | boolean | undefined | null;

export type TISerializablePayload = Record<string | number | symbol, unknown> | TSerializableValues;