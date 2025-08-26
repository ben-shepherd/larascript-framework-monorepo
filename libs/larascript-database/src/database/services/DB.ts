import { IEloquent, IEloquentQueryBuilderService } from "@/eloquent";
import { IModel, ModelConstructor } from "@/model";
import { ICryptoService } from '@larascript-framework/crypto-js';
import { BaseSingleton, CreateDependencyLoader, DependencyLoader, RequiresDependency } from "@larascript-framework/larascript-core";
import { IEventService } from "@larascript-framework/larascript-events";
import { ILoggerService } from "../../../../larascript-logger/dist";
import { IDatabaseService } from "../interfaces/service.t";


export type InitTypes = {
    databaseService: IDatabaseService;
    eloquentQueryBuilder: IEloquentQueryBuilderService;
    cryptoService: ICryptoService;
    eventsService: IEventService;
    logger: ILoggerService;
}

class DB extends BaseSingleton implements RequiresDependency {

    protected _databaseService!: IDatabaseService;

    protected _eloquentQueryBuilderService!: IEloquentQueryBuilderService;

    protected _cryptoService!: ICryptoService;

    protected _eventsService!: IEventService;

    protected _logger!: ILoggerService;

    public static init({ databaseService, eloquentQueryBuilder, cryptoService, eventsService, logger }: InitTypes) {
        DB.getInstance().setDependencyLoader(
            CreateDependencyLoader.create({
                databaseService,
                eloquentQueryBuilder,
                cryptoService,
                eventsService,
                logger
            })
        )
    }

    setDependencyLoader(loader: DependencyLoader): void {
        if(typeof loader("eloquentQueryBuilder") === 'undefined') {
            throw new Error("EloquentQueryBuilderService is not a valid dependency")
        }
        
        if(typeof loader("databaseService") === 'undefined') {
            throw new Error("DatabaseService is not a valid dependency")
        }

        if(typeof loader("cryptoService") === 'undefined') {
            throw new Error("CryptoService is not a valid dependency")
        }

        if(typeof loader("eventsService") === 'undefined') {
            throw new Error("EventsService is not a valid dependency")
        }
        
        this._databaseService = loader("databaseService")
        this._eloquentQueryBuilderService = loader("eloquentQueryBuilder")
        this._cryptoService = loader("cryptoService")
        this._eventsService = loader("eventsService")
    }

    databaseService(): IDatabaseService {
        if(!this._databaseService) {
            throw new Error("DatabaseService is not initialized")
        }

        return this._databaseService
    }

    queryBuilder<Model extends IModel>(modelCtor: ModelConstructor<Model>, connectionName?: string): IEloquent<Model> {
        if(!this._eloquentQueryBuilderService) {
            throw new Error("EloquentQueryBuilderService is not initialized")
        }

        return this._eloquentQueryBuilderService.builder(modelCtor, connectionName);
    }

    cryptoService(): ICryptoService {
        if(!this._cryptoService) {
            throw new Error("CryptoService is not initialized")
        }

        return this._cryptoService
    }

    eventsService(): IEventService {
        if(!this._eventsService) {
            throw new Error("EventsService is not initialized")
        }

        return this._eventsService
    }

    logger(): ILoggerService | undefined {
        if(!this._logger) {
            return undefined
        }

        return this._logger
    }
}

export default DB