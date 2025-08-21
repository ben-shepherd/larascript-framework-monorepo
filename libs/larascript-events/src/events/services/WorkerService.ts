import { ILoggerService } from "@larascript-framework/larascript-logger";
import { EventWorkerException } from "../exceptions/EventWorkerException";
import { IWorkerAttributes, IWorkerModel, IWorkerModelFactory, IWorkerRepository, IWorkerService, TEventWorkerOptions } from "../interfaces";
import { IEventService } from "../interfaces/services.t";

export class WorkerService implements IWorkerService {


        private workerRepository!: IWorkerRepository;

        private workerFactory!: IWorkerModelFactory;

        private logger?: ILoggerService;

        private eventService!: IEventService;

        /**
         *  
         * Run the worker to process queued event items
         *
         * Fetches documents from the worker model repository and runs each
         * document through the handleWorkerModel method. This method is
         * responsible for processing the event contained in the document.
         *
         * @param options The options to use when running the worker
         * @returns A promise that resolves once the worker has finished
         *          processing the documents.
         */
        async runWorker(options: TEventWorkerOptions): Promise<void> {

            const workerModels = await this.workerRepository.getWorkers()

            this.logger?.console('Queued items: ', workerModels.length)

            if (workerModels.length === 0) {
                this.logger?.console("No queued items");
                return;
            }

            for (const workerModel of workerModels) {
                await this.handleWorkerModel(workerModel, options)
            }
        }

        getRepository(): IWorkerRepository {
            return this.workerRepository;
        }

        setWorkerRepository(workerRepository: IWorkerRepository): void {
            this.workerRepository = workerRepository;
        }

        setWorkerFactory(workerFactory: IWorkerModelFactory): void {
            this.workerFactory = workerFactory;
        }
        getFactory(): IWorkerModelFactory {
            return this.workerFactory;
        }

        setLogger(logger?: ILoggerService): void {
            this.logger = logger;
        }

        setEventService(eventService: IEventService): void {
            this.eventService = eventService;
        }

        /**
         * Handles a single worker model document
         * @param worker The worker model document to process
         * @param options The options to use when processing the event
         * @private
         */
        private async handleWorkerModel(worker: IWorkerModel, options: TEventWorkerOptions): Promise<void> {
            try {
                const eventName = worker.getWorkerData()?.eventName

                if (typeof eventName !== 'string') {
                    throw new EventWorkerException('Event name must be a string');
                }

                const eventCtor = this.eventService.getEventCtorByName(eventName)

                if (!eventCtor) {
                    throw new EventWorkerException(`Event '${eventName}' not found`);
                }

                const payload = worker.getWorkerData()?.payload
                const eventInstance = new eventCtor(payload);
                await eventInstance.execute();

                await worker.deleteWorkerData();
            }
            catch (err) {
                this.logger?.error(err)
                await this.handleUpdateWorkerModelAttempts(worker, options, (err as Error))
            }
        }

        /**
         * Handles updating the worker model document with the number of attempts
         * it has made to process the event.
         * @param workerModel The worker model document to update
         * @param options The options to use when updating the worker model document
         * @private
         */
        private async handleUpdateWorkerModelAttempts(worker: IWorkerModel, options: TEventWorkerOptions, error?: Error) {  

            const attempt = worker.getWorkerData()?.attempts ?? 0
            const newAttempt = attempt + 1
            const retries = worker.getWorkerData()?.retries ?? 0

            await worker.updateWorkerData({ 
                ...(worker.getWorkerData() ?? {}),
                attempts: newAttempt 
            } as IWorkerAttributes)

            if (newAttempt >= retries) {
                await this.handleFailedWorkerModel(worker, options, error)
                return;
            }

            await worker.saveWorkerData();
        }

        /**
         * Handles a worker model that has failed to process.
         *
         * Saves a new instance of the failed worker model to the database
         * and deletes the original worker model document.
         *
         * @param workerModel The worker model document to handle
         * @param options The options to use when handling the failed worker model
         * @private
         */
        private async handleFailedWorkerModel(worker: IWorkerModel, options: TEventWorkerOptions, error?: Error) {

            const FailedWorkerModel = this.workerFactory.createFailedWorkerModel({
                attempts: worker.getWorkerData()?.attempts ?? 0,
                retries: worker.getWorkerData()?.retries ?? 0,
                eventName: worker.getWorkerData()?.eventName ?? '',
                queueName: worker.getWorkerData()?.queueName ?? '',
                payload: worker.getWorkerData()?.payload ?? '{}',
                error: (error?.message ?? '') + '\n' + (error?.stack ?? ''),
                createdAt: new Date(),
                updatedAt: new Date(),
                failedAt: new Date()
            } as IWorkerAttributes)

            await FailedWorkerModel.saveWorkerData();
            await worker.deleteWorkerData();
        }

    }