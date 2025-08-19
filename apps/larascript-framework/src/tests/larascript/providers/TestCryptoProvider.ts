import { EnvironmentTesting } from "@larascript-framework/larascript-core";
import { IAppConfig } from "@src/config/app.config";
import CryptoProvider from "@src/core/providers/CryptoProvider";


class TestCryptoProvider extends CryptoProvider {

    config: IAppConfig = {
        env: EnvironmentTesting,
        appKey: 'test-app-key',
        appName: 'Larascript Framework'
    } as IAppConfig

}

export default TestCryptoProvider