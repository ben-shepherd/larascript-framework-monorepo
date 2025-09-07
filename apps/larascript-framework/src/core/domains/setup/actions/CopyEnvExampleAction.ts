import { IAction } from "@/core/domains/setup/interfaces/IAction.js";
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";
import fs from 'fs';

class CopyEnvExampleAction implements IAction {

    async handle(ref: ISetupCommand): Promise<any> {
        if(fs.existsSync(ref.env.envPath)) {
            ref.writeLine('Warning: Skipping copying .env.example to .env because .env already exists');
            return;
        }
        
        ref.env.copyFileFromEnvExample();

        ref.writeLine('Successfully copied .env.example to .env');
    }

}

export default CopyEnvExampleAction