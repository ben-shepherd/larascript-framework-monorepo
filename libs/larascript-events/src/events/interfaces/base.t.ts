import { IHasCastableConcern } from "@larascript-framework/larascript-utils";
import { IExecutable, INameable } from "./types.t";

export interface IBaseSubscriber<TPayload = unknown> extends IBaseEvent<TPayload> {
    type: 'subscriber';
}

export interface IBaseListener<TPayload = unknown> extends IBaseEvent<TPayload> {
    type: 'listener';
}

export interface IBaseEvent<TPayload = unknown> extends INameable, IExecutable, IHasCastableConcern
{
    getQueueName(): string;
    getDriverName(): string | undefined;
    getPayload(): TPayload;
    setPayload(payload: TPayload): void;
    getName(): string;
}