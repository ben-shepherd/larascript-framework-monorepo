import { IMigrationFileService } from "@larascript-framework/contracts/migrations";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { ILoggerService } from "@larascript-framework/larascript-logger";

export type MakeServicesConfig = {
    logger: ILoggerService;
    migrationFileService: IMigrationFileService;
}

export default class MakeServices extends BaseSingleton<MakeServicesConfig> {

    static init({
        logger,
        migrationFileService,
    }: MakeServicesConfig): void {
        MakeServices.getInstance({
            logger,
            migrationFileService,
        });
    }

    public getLoggerService(): ILoggerService | undefined {
        return this.getConfig()?.logger;
    }

    public getMigrationFileService(): IMigrationFileService {
        if(!this.getConfig()?.migrationFileService) {
            throw new Error('Migration file service not found');
        }
        return this.getConfig()?.migrationFileService!;
    }
}