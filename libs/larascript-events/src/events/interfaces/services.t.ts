import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IBaseEvent } from "./base.t";
import { IEventConfig } from "./config.t";
import { IEventDriver, IEventDriversConfigOption } from "./driver.t";
import { SubscriberConstructor } from "./event.t";
import { IDispatchable } from "./types.t";

export interface IEventService extends IDispatchable
{
    getConfig(): IEventConfig;

    registerConfig(): void;
    
    getDefaultDriverCtor(): TClassConstructor<IEventDriver>;

    getDriverOptions(driver: IEventDriver): IEventDriversConfigOption | undefined;

    getDriverOptionsByName(driverName: string): IEventDriversConfigOption | undefined;

    getEventCtorByName(eventName: string): TClassConstructor<IBaseEvent> | undefined;

    getSubscribers(eventName: string): SubscriberConstructor[];

}