import { IStorageFile } from "./IStorageFile";
import { IStorageService } from "./IStorageService.t";

export interface IGenericStorage {
  getStorageService(): IStorageService;
  put(file: IStorageFile | string, destination?: string): Promise<IStorageFile>;
  get(file: IStorageFile | string, ...args: unknown[]): Promise<IStorageFile>;
  delete(file: IStorageFile | string): Promise<void>;
}
