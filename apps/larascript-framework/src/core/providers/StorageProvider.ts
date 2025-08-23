import { BaseProvider } from '@larascript-framework/larascript-core';
import { StorageService } from '@larascript-framework/larascript-storage';
import { config } from '@src/config/storage.config';


class StorageProvider extends BaseProvider {

    async register(): Promise<void> {
        const storage = new StorageService(config);
        this.bind('storage', storage);       
    }

}

export default StorageProvider;
