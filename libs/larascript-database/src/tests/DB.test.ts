import { IDatabaseService } from "@/database/interfaces/service.t";
import DB from "@/database/services/DB";
import { IEloquent, IEloquentQueryBuilderService } from "@/eloquent";
import { IModel, IModelAttributes, ModelConstructor } from "@/model/interfaces/model.t";
import { beforeEach, describe, test } from "@jest/globals";
import { ICryptoService } from "@larascript-framework/crypto-js";
import { IEventService } from "@larascript-framework/larascript-events";

describe("Example Test Suite", () => {
  let mockModel: ModelConstructor<IModel<IModelAttributes>>;

  describe("DB", () => {

    beforeEach(() => {

        mockModel = jest.fn().mockImplementation((...args: any[]) => {
            return {} as unknown as ModelConstructor<IModel<IModelAttributes>>
        }) as unknown as ModelConstructor<IModel<IModelAttributes>>;

        const databaseServiceMock = jest.fn().mockImplementation((...args: any[]) => {
            return {} as unknown as IDatabaseService
        });

        const eventServiceMock = jest.fn().mockImplementation((...args: any[]) => {
            return {} as unknown as IEventService
        });

        const cryptoServiceMock = jest.fn().mockImplementation((...args: any[]) => {
            return {} as unknown as ICryptoService
        });

        const eloquentQueryBuilderMock = jest.fn().mockImplementation((...args: any[]) => {
            return {
                builder: jest.fn().mockImplementation((...args: any[]) => {
                    return {} as unknown as IEloquent
                })
            } as unknown as IEloquentQueryBuilderService
        });

        DB.init({
            databaseService: databaseServiceMock(),
            eloquentQueryBuilder: eloquentQueryBuilderMock(),
            cryptoService: cryptoServiceMock(),
            eventsService: eventServiceMock()
        })
    })

    test("init", () => {
        expect(DB.getInstance().databaseService()).toBeDefined()
        expect(DB.getInstance().queryBuilder(mockModel, 'test')).toBeDefined()
        expect(DB.getInstance().cryptoService()).toBeDefined()
        expect(DB.getInstance().eventsService()).toBeDefined()
    })
  });
});
