import { EVENT_DRIVERS } from "../consts/drivers";
import { IBaseEvent, IEventDriver, IEventDriversConfigOption, IEventService } from "../interfaces";

/**
 * Abstract base class for event drivers
 * Provides common functionality for event dispatching and configuration management
 */
export abstract class BaseDriver implements IEventDriver {

    _type: keyof typeof EVENT_DRIVERS = EVENT_DRIVERS.SYNC as keyof typeof EVENT_DRIVERS;

    /** The event service instance */
    protected eventService!: IEventService;

    /**
     * Creates a new BaseDriver instance
     * @param eventService - The event service to use for configuration and dispatching
     */
    constructor(eventService: IEventService) {
        this.eventService = eventService
    }

    /**
     * Gets the name of the event driver
     * @returns The name of the event driver as a string
     */
    getName(): string {
        return this.constructor.name
    }

    /**
     * Dispatches an event
     * This method must be implemented by subclasses to provide specific dispatching logic
     * @param event - The event to dispatch
     * @returns Promise that resolves when the event is dispatched
     */
    abstract dispatch(event: IBaseEvent): Promise<void>;

    /**
     * Gets the configuration options for this event driver
     * @template T - The type of options to return
     * @returns The configuration options for this driver, or undefined if not found
     */
    protected getOptions<T extends IEventDriversConfigOption['options'] = {}>(): T | undefined {
        return this.eventService.getDriverOptions(this)?.options as T ?? undefined
    }

}

export default BaseDriver