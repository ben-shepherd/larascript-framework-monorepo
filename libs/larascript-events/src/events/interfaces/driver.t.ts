import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { IDispatchable, INameable } from "./types.t";

/**
 * Interface for event drivers that handle event dispatching
 */
export interface IEventDriver extends INameable, IDispatchable {}

/**
 * Configuration option for event drivers
 */
export interface IEventDriversConfigOption {
    /** The driver constructor */
    driverCtor: TClassConstructor<IEventDriver>,
    /** Optional configuration options for the driver */
    options?: Record<string, unknown>;
}

/**
 * Registry of event drivers by name
 */
export type TEventDriversRegister = Record<string, IEventDriversConfigOption>;

/**
 * Configuration for multiple event drivers
 */
export interface IEventDriversConfig
{
    [key: string]: IEventDriversConfigOption
}

