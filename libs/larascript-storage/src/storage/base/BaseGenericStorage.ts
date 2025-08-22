import { IStorageService } from "../interfaces";

export abstract class BaseGenericStorage {
  constructor(protected readonly storageService: IStorageService) {}

  getStorageService(): IStorageService {
    return this.storageService;
  }
}
