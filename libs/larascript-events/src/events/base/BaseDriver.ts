import { IBaseEvent, IEventDriver, IEventDriversConfigOption, IEventService } from "../interfaces";

abstract class BaseDriver implements IEventDriver {

    protected eventService!: IEventService;

    constructor(eventService: IEventService) {
        this.eventService = eventService
    }

    /**
     * @returns The name of the event driver.
     */
    getName(): string {
        return this.constructor.name
    }

    /**
     * Dispatches an event.
     * @param event 
     */
    abstract dispatch(event: IBaseEvent): Promise<void>;

    /**
     * @returns The configuration options for this event driver, or undefined if not found.
     */
    protected getOptions<T extends IEventDriversConfigOption['options'] = {}>(): T | undefined {
        return this.eventService.getDriverOptions(this)?.options as T ?? undefined
    }

}

export default BaseDriver