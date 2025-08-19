import { BaseProvider, EnvService } from "@larascript-framework/larascript-core";
import path from "path";

class EnvServiceProvider extends BaseProvider {

    async register(): Promise<void> {
        const envService = new EnvService({
            envPath: path.resolve('@src/../', '.env'),
            envExamplePath: path.resolve('@src/../', '.env.example')
        }) 

        this.bind('envService', envService)
    }

}

export default EnvServiceProvider