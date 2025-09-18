import { BaseSingleton, IEnvService } from "@larascript-framework/larascript-core";

type SetupServiceConfig = {
    envService: IEnvService;
}

export class SetupService extends BaseSingleton<SetupServiceConfig> {

    static init(config: SetupServiceConfig) {
        this.getInstance(config);
    }

    setEnvService(envService: IEnvService) {
        this.config!.envService = envService;
    }

    getEnvService(): IEnvService {
        if(!this.config?.envService) {
            throw new Error('EnvService has not been initialized');
        }
        return this.config?.envService;
    }

}
