
import { TClassConstructor } from "@larascript-framework/larascript-utils";
import { BaseEventListener } from "../base";
import EventDispatchException from "../exceptions/EventDispatchException";
import EventNotDispatchedException from "../exceptions/EventNotDispatchedException";
import { IBaseEvent, IEventDriver, IEventDriversConfigOption, IEventService, SubscriberConstructor, TEventWorkerOptions, TListenersConfigOption, TMockableEventCallback } from "../interfaces";
import { IEventConfig } from "../interfaces/config.t";
import EventRegistry from "../registry/EventRegistry";

/**
 * The event service is responsible for managing the event system.
 * It provides features like dispatching events, registering event listeners
 * and drivers.
 * 
 * @class EventService
 * @extends BaseEventService
 * @implements IEventService
 */
class EventService implements IEventService {

    /** Array of events to mock */
    mockEvents: TClassConstructor<IBaseEvent>[] = [];

    /** Array of events that have been dispatched */
    mockEventsDispatched: IBaseEvent[] = [];

    /** The event configuration. */
    protected readonly config: IEventConfig;

    /** The registered events. */
    protected readonly registeredEvents: Record<string, TClassConstructor<IBaseEvent>> = {};

    /** The registered drivers. */
    protected readonly registeredDrivers: Record<string, IEventDriversConfigOption> = {};

    /** The registered listeners. */
    protected readonly registeredListeners: Record<string, TListenersConfigOption> = {};

    /**
     * Creates a new event service.
     * @param config The event configuration.
     */
    constructor(config: IEventConfig) {
        this.config = config
    }
    runWorker(options: TEventWorkerOptions): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Retrieves the name of the event driver from its constructor.
     * @param driver The constructor of the event driver.
     * @returns The name of the event driver as a string.
     */
    public static getDriverName(driver: TClassConstructor<IEventDriver>): string {
        return driver.name
    }

    /**
     * @param driverCtor The event driver class.
     * @param options The event driver options.
     * @returns The event driver config.
     */
    public static createConfigDriver<T extends IEventDriversConfigOption['options'] = {}>(driverCtor: TClassConstructor<IEventDriver>, options?: T): IEventDriversConfigOption {
        return {
            driverCtor,
            options
        }
    }

    /**
     * @returns The current event configuration as an instance of IEventConfig.
     */
    getConfig(): IEventConfig {
        return this.config
    }

    /**
     * Dispatch an event using its registered driver.
     * @param event The event to be dispatched.
     */
    async dispatch(event: IBaseEvent): Promise<void> {

        if (!this.isRegisteredEvent(event)) {
            throw new EventDispatchException(`Event '${event.getName()}' not registered. The event must be exported and registered with EventRegistry.register(event).`)
        }

        // Mock the dispatch before dispatching the event, as any errors thrown during the dispatch will not be caught
        this.mockEventDispatched(event)

        const eventDriverCtor = event.getDriverCtor()
        const eventDriver = new eventDriverCtor(this)
        await eventDriver.dispatch(event)

        // Notify all subscribers of the event
        if (event instanceof BaseEventListener) {
            await this.notifySubscribers(event);
        }
    }

    /**
     * Register the config with the event service
     */
    registerConfig(): void {
        // Register the drivers
        for (const driverKey of Object.keys(this.config.drivers)) {
            this.registeredDrivers[driverKey] = this.config.drivers[driverKey]
        }

        // Register all events from the registry
        for (const event of EventRegistry.getEvents()) {
            this.registeredEvents[new event().getName()] = event
        }

        // Register all listeners
        for (const listenerKey of Object.keys(this.config.listeners)) {
            this.registeredListeners[listenerKey] = this.config.listeners[listenerKey]
        }

        // Mark the registry as initialized since event service is now available
        EventRegistry.setInitialized();
    }

    /**
     * @param event The event class to be checked
     * @returns True if the event is registered, false otherwise
     * @private
     */
    private isRegisteredEvent(event: IBaseEvent): boolean {
        return this.registeredEvents[event.getName()] !== undefined
    }


    /**
     * Get the default event driver constructor.
     * @returns The default event driver constructor.
     */
    getDefaultDriverCtor(): TClassConstructor<IEventDriver> {
        return this.config.defaultDriver
    }

    /**
     * Retrieves the configuration options for a given event driver constructor.
     * @param driverCtor The constructor of the event driver.
     * @returns The configuration options for the specified event driver, or undefined if not found.
     */
    getDriverOptions(driver: IEventDriver): IEventDriversConfigOption | undefined {
        return this.getDriverOptionsByName(driver.getName())
    }

    /**
     * Retrieves the configuration options for a given event driver by name.
     * @param driverName The name of the event driver.
     * @returns The configuration options for the specified event driver, or undefined if not found.
     */
    getDriverOptionsByName(driverName: string): IEventDriversConfigOption | undefined {
        return this.registeredDrivers[driverName]
    }

    /**
     * Retrieves the event constructor for a given event name.
     * @param eventName The name of the event.
     * @returns The event constructor for the specified event, or undefined if not found.
     */
    getEventCtorByName(eventName: string): TClassConstructor<IBaseEvent> | undefined {
        return this.registeredEvents[eventName]
    }

    /**
     * Notifies all subscribers of this event that the event has been dispatched.
     *
     * Retrieves all subscribers of this event from the event service, creates
     * a new instance of each subscriber, passing the payload of this event to
     * the subscriber's constructor, and then dispatches the subscriber event
     * using the event service.
     */
    async notifySubscribers(eventListener: BaseEventListener) {
        const subscribers = this.getSubscribers(eventListener.getName());

        for (const subscriber of subscribers) {
            const eventSubscriber = new subscriber(null);
            eventSubscriber.setPayload(eventListener.getPayload());

            await this.dispatch(eventSubscriber);
        }
    }

    /**
     * Returns an array of event subscriber constructors that are listening to this event.
     * @returns An array of event subscriber constructors.
     */
    getSubscribers(eventName: string): SubscriberConstructor[] {
        return this.registeredListeners[eventName]?.subscribers ?? [];
    }

    /**
 * Mocks an event to be dispatched.
 * 
 * The mocked event will be added to the {@link mockEvents} array.
 * When the event is dispatched, the {@link mockEventDispatched} method
 * will be called and the event will be added to the {@link mockEventsDispatched} array.
 * 
 * @param event The event to mock.
 */
    mockEvent(event: TClassConstructor<IBaseEvent>): void {
        this.mockEvents.push(event)
        this.removeMockEventDispatched(event)
    }

    /**
     * Removes the given event from the {@link mockEvents} array.
     * 
     * @param event - The event to remove from the {@link mockEvents} array.
     */
    removeMockEvent(event: TClassConstructor<IBaseEvent>): void {
        this.mockEvents = this.mockEvents.filter(e => (new e).getName() !== (new event).getName())
    }

    /**
     * This method is called when an event is dispatched. It will check if the event
     * has been mocked with the {@link mockEvent} method. If it has, the event will be
     * added to the {@link mockEventsDispatched} array.
     * 
     * @param event - The event that was dispatched.
     */
    mockEventDispatched(event: IBaseEvent): void {

        const shouldMock = this.mockEvents.find(eCtor => (new eCtor(null)).getName() === event.getName())

        if (!shouldMock) {
            return
        }

        this.mockEventsDispatched.push(event)
    }

    /**
     * Removes all events from the {@link mockEventsDispatched} array that match the given event constructor.
     * 
     * @param event - The event to remove from the {@link mockEventsDispatched} array.
     */
    removeMockEventDispatched(event: TClassConstructor<IBaseEvent>): void {
        this.mockEventsDispatched = this.mockEventsDispatched.filter(e => e.getName() !== (new event).getName())
    }


    /**
     * Asserts that a specific event has been dispatched and that its payload satisfies the given condition.
     * 
     * @param eventCtor - The event to check for dispatch.
     * @param callback - A function that takes the event payload and returns a boolean indicating 
     *                   whether the payload satisfies the condition.
     * 
     * @throws Will throw an error if the event was not dispatched or if the dispatched event's 
     *         payload does not satisfy the given condition.
     */
    assertDispatched<TPayload = unknown>(eventCtor: TClassConstructor<IBaseEvent>, callback?: TMockableEventCallback<TPayload>): boolean {
        const eventCtorName = (new eventCtor(null)).getName()
        const dispatchedEvent = this.mockEventsDispatched.find(e => e.getName() === eventCtorName)

        if (!dispatchedEvent) {
            throw new EventNotDispatchedException(`Event ${eventCtorName} was not dispatched`)
        }

        if (typeof callback !== 'function') {
            return true;
        }

        return callback(dispatchedEvent.getPayload() as TPayload)
    }

    /**
     * Resets the {@link mockEvents} and {@link mockEventsDispatched} arrays.
     */
    resetMockEvents(): void {
        this.mockEvents = [];
        this.mockEventsDispatched = [];
    }

}

export default EventService