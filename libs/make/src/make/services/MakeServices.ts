import { IMigrationFileService } from "@larascript-framework/contracts/migrations";
import { BaseSingleton } from "@larascript-framework/larascript-core";
import { ILoggerService } from "@larascript-framework/larascript-logger";

export type MakeServicesConfig = {
    logger?: ILoggerService;
    migrationFileService: IMigrationFileService;
    pathToApp: string;
    pathToTemplates: string;
    processExit?: boolean;
}

export class MakeServices extends BaseSingleton<MakeServicesConfig> {

    static init({
        logger,
        migrationFileService,
        pathToApp,
        pathToTemplates,
        processExit,
    }: MakeServicesConfig): void {
        MakeServices.getInstance({
            logger,
            migrationFileService,
            pathToApp,
            pathToTemplates,
            processExit,
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

    public getPathToApp(): string {
        if(!this.getConfig()?.pathToApp) {
            throw new Error('Path to app not found');
        }
        return this.getConfig()?.pathToApp!;
    }

    public getPathToTemplates(): string {
        if(!this.getConfig()?.pathToTemplates) {
            throw new Error('Path to templates not found');
        }
        return this.getConfig()?.pathToTemplates!;
    }

    public getProcessExit(): boolean {
        return this.getConfig()?.processExit ?? false;
    }
}

export default MakeServices;