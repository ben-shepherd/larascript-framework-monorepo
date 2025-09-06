import { BaseProvider } from "@larascript-framework/larascript-core";
import { EventService, IEventConfig, WorkerCommand, WorkerModelFactory, WorkerRepository, WorkerService, WorkerServiceProvider } from "@larascript-framework/larascript-events";
import { eventConfig } from "@src/config/events.config";
import { app } from "@src/core/services/App";

class EventProvider extends BaseProvider {

    protected config: IEventConfig = eventConfig;

    async register(): Promise<void> {
        
        // Create the event Service and register the drivers, events and listeners
        const eventService = new EventService(this.config);
        eventService.registerConfig();
        
        // Create the worker service and register the worker repository
        const workerService = new WorkerService();
        workerService.setEventService(eventService);
        workerService.setWorkerRepository(new WorkerRepository());
        workerService.setWorkerFactory(new WorkerModelFactory());
        
        // Bind the services to the container
        this.bind('events', eventService);
        this.bind('events.worker', workerService);

        // Register the worker command
        app('console').registerService().registerAll([
            WorkerCommand
        ])

        // Init the worker service provider
        WorkerServiceProvider.init({
            workerService,
            eventService,
            eloquentQueryBuilder: app('query'),
            logger: app('logger')
        })
    }

}

export default EventProvider