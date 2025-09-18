import { BaseSingleton, IEnvService, IPackageJsonService } from "@larascript-framework/larascript-core";

type SetupServiceConfig = {
    envService: IEnvService;
    packageJsonService: IPackageJsonService;
}

export class SetupService extends BaseSingleton<SetupServiceConfig> {

    static init(config: SetupServiceConfig) {
        this.getInstance(config);
    }

    setEnvService(envService: IEnvService) {
        this.config!.envService = envService;
    }

    setPackageJsonService(packageJsonService: IPackageJsonService) {
        this.config!.packageJsonService = packageJsonService;
    }

    getEnvService(): IEnvService {
        if(!this.config?.envService) {
            throw new Error('EnvService has not been initialized');
        }
        return this.config?.envService;
    }

    getPackageJsonService(): IPackageJsonService {
        if(!this.config?.packageJsonService) {
            throw new Error('PackageJsonService has not been initialized');
        }
        return this.config?.packageJsonService;
    }

}
