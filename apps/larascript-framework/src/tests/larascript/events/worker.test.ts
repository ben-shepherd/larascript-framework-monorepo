/* eslint-disable no-undef */
import { app } from '@/core/services/App.js';
import testHelper from '@/tests/testHelper.js';
import { describe } from '@jest/globals';
import { BaseEvent, EventRegistry, EventService, FailedWorkerModel, IEventService, IWorkerService, WorkerModel, WorkerService } from '@larascript-framework/larascript-events';

class TestEvent extends BaseEvent<{ foo: string, bar?: object, arr?: string[] }> {

    queueName: string = 'testing';

    queable: boolean = true;

    constructor(payload: { foo: string, bar?: object, arr?: string[] }) {
        super(payload);
    }
}

describe('Worker Test Suite', () => {
    let eventService: IEventService;
    let workerService: IWorkerService;
    
    beforeAll(async () => {
        EventRegistry.register(TestEvent)

        await testHelper.testBootApp();

        eventService = app('events')
        workerService = app('events.worker')

        await app('db').schema().dropTable(WorkerModel.getTable())
        await app('db').schema().dropTable(FailedWorkerModel.getTable())

        await app('db').schema().createTable(WorkerModel.getTable(), workerService.getSequelizeSchema())
        await app('db').schema().createTable(FailedWorkerModel.getTable(), workerService.getSequelizeSchema())
    })

    test('bound services', async () => {
        expect(eventService).toBeInstanceOf(EventService);
        expect(workerService).toBeInstanceOf(WorkerService);
    })

    test('can store event in worker repository', async () => {

        await eventService.dispatch(
            new TestEvent({ foo: 'bar', bar: { baz: 'qux' }, arr: ['qux', 'quux'] })
        )

        const record = await workerService.getRepository().getWorkers();

        expect(record.length).toBe(1);
        expect(record[0].getWorkerData()?.payload).toEqual({ foo: 'bar', bar: { baz: 'qux' }, arr: ['qux', 'quux'] });
        expect(record[0].getWorkerData()?.attempts).toBe(0);
        expect(record[0].getWorkerData()?.retries).toBe(3);
        expect(record[0].getWorkerData()?.queueName).toBe('testing');
        expect(record[0].getWorkerData()?.eventName).toBe('TestEvent');

    })

})