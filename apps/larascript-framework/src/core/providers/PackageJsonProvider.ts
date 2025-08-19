import { BaseProvider, PackageJsonService } from "@larascript-framework/larascript-core";
import path from "path";

class PackageJsonProvider extends BaseProvider {

    async register(): Promise<void> {
        const packageJsonService = new PackageJsonService({
            packageJsonPath: path.resolve('@src/../', 'package.json')
        }) 

        this.bind('packageJsonService', packageJsonService)
    }

}

export default PackageJsonProvider