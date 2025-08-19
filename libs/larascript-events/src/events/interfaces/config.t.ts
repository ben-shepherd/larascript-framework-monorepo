import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IEventDriver, IEventDriversConfig } from "./driver.t";
import { TListenersConfigOption } from "./event.t";

/**
 * Configuration interface for the event system
 */
export interface IEventConfig {
    /** Default driver constructor to use */
    defaultDriver: TClassConstructor<IEventDriver>;
    /** Configuration for available drivers */
    drivers: IEventDriversConfig;
    /** Configuration for event listeners */
    listeners: TListenersConfigOption[];
}