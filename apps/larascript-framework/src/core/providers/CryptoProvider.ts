import { CryptoService } from "@larascript-framework/crypto-js";
import { BaseProvider } from "@larascript-framework/larascript-core";
import appConfig, { IAppConfig } from "@src/config/app.config";

class CryptoProvider extends BaseProvider {

    config: IAppConfig = appConfig;

    async register(): Promise<void> {

        const cryptoService = new CryptoService({
            secretKey: this.config.appKey
        })

        // Bind the crypto service
        this.bind('crypto', cryptoService)

    }
       
}

export default CryptoProvider