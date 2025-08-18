import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IEventDriver, IEventDriversConfig } from "./driver.t";
import { TListenersConfigOption } from "./event.t";

export interface IEventConfig {
    defaultDriver: TClassConstructor<IEventDriver>;
    drivers: IEventDriversConfig;
    listeners: TListenersConfigOption[];
}