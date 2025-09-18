import { BaseCommand } from "@larascript-framework/larascript-console";
import { IEnvService } from "@larascript-framework/larascript-core";
import { ISetupCommand } from "../interfaces/ISetupCommand.js";
import { SetupService } from "../providers/SetupService.js";

export abstract class BaseSetupCommand extends BaseCommand implements ISetupCommand {

    writeLine(line: string): void {
        this.input.writeLine(line);
    }

    get env(): IEnvService {
        return SetupService.getInstance().getEnvService();
    }

    setEnvService(envService: IEnvService) {
        SetupService.getInstance().getEnvService();
    }

}