import { IEloquent, IEloquentQueryBuilderService } from "@/eloquent";
import { IModel, ModelConstructor } from "@/model";
import { ICryptoService } from "@larascript-framework/crypto-js";
import {
  BaseSingleton,
  CreateDependencyLoader,
  DependencyLoader,
  RequiresDependency,
} from "@larascript-framework/larascript-core";
import { ILoggerService } from "../../../../larascript-logger/dist";
import { IDatabaseService } from "../interfaces/service.t";
export type InitTypes = {
  app?: (name: string) => unknown;
  databaseService: IDatabaseService;
  eloquentQueryBuilder: IEloquentQueryBuilderService;
  cryptoService: ICryptoService;
  dispatcher: (...args: any[]) => Promise<void>;
  logger?: ILoggerService;
};

export class DB extends BaseSingleton implements RequiresDependency {
  protected _databaseService!: IDatabaseService;

  protected _eloquentQueryBuilderService!: IEloquentQueryBuilderService;

  protected _cryptoService!: ICryptoService;

  protected _dispatcher!: (...args: any[]) => Promise<void>;

  protected _logger?: ILoggerService;

  public static init({
    databaseService,
    eloquentQueryBuilder,
    cryptoService,
    dispatcher,
    logger,
  }: InitTypes) {
    DB.getInstance().setDependencyLoader(
      CreateDependencyLoader.create({
        databaseService,
        eloquentQueryBuilder,
        cryptoService,
        dispatcher,
        logger,
      }),
    );
  }

  setDependencyLoader(loader: DependencyLoader): void {
    if (typeof loader("eloquentQueryBuilder") === "undefined") {
      throw new Error("EloquentQueryBuilderService is not a valid dependency");
    }

    if (typeof loader("databaseService") === "undefined") {
      throw new Error("DatabaseService is not a valid dependency");
    }

    if (typeof loader("cryptoService") === "undefined") {
      throw new Error("CryptoService is not a valid dependency");
    }

    if (typeof loader("dispatcher") === "undefined") {
      throw new Error("Dispatcher is not a valid dependency");
    }

    this._databaseService = loader("databaseService");
    this._eloquentQueryBuilderService = loader("eloquentQueryBuilder");
    this._cryptoService = loader("cryptoService");
    this._dispatcher = loader("dispatcher");
    this._logger = loader("logger");
  }

  databaseService(): IDatabaseService {

    if (!this._databaseService) {
      throw new Error("DatabaseService is not initialized");
    }

    return this._databaseService;
  }

  queryBuilderService(): IEloquentQueryBuilderService {
    if (!this._eloquentQueryBuilderService) {
      throw new Error("EloquentQueryBuilderService is not initialized");
    }

    return this._eloquentQueryBuilderService;
  }

  queryBuilder<Model extends IModel>(
    modelCtor: ModelConstructor<Model>,
    connectionName?: string,
  ): IEloquent<Model> {
    if (!this._eloquentQueryBuilderService) {
      throw new Error("EloquentQueryBuilderService is not initialized");
    }

    return this._eloquentQueryBuilderService.builder(modelCtor, connectionName);
  }

  cryptoService(): ICryptoService {
    if (!this._cryptoService) {
      throw new Error("CryptoService is not initialized");
    }

    return this._cryptoService;
  }

  dispatcher(...args: any[]): Promise<void> {
    if (!this._dispatcher) {
      throw new Error("Dispatcher is not initialized");
    }

    return this._dispatcher(...args);
  }

  logger(): ILoggerService | undefined {
    if (!this._logger) {
      return undefined;
    }

    return this._logger;
  }
}

export default DB;
