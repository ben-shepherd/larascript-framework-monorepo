import { BaseProvider } from "@larascript-framework/larascript-core";
import { EventService, IEventConfig, WorkerService } from "@larascript-framework/larascript-events";
import { eventConfig } from "@src/config/events.config";
import WorkerCommand from "@src/core/domains/events/commands/WorkerCommand";
import { app } from "@src/core/services/App";
import { WorkerRepository } from "../repository/WorkerRepository";
import { WorkerCreator } from "../services/WorkerCreator";

class EventProvider extends BaseProvider {

    protected config: IEventConfig = eventConfig;

    async register(): Promise<void> {
        
        // Create the event Service and register the drivers, events and listeners
        const eventService = new EventService(this.config);
        eventService.registerConfig();
        this.bind('events', eventService);

        // Create the worker service and register the worker repository
        const workerService = new WorkerService();
        workerService.setEventService(eventService);
        workerService.setWorkerRepository(new WorkerRepository());
        workerService.setWorkerCreator(new WorkerCreator());
        workerService.setLogger(app('logger'));
        this.bind('events.worker', workerService);

        // Register the worker command
        app('console').registerService().registerAll([
            WorkerCommand
        ])
    }

}

export default EventProvider