import QuestionDTO from "@/core/domains/setup/DTOs/QuestionDTO.js";
import { IAction } from "@/core/domains/setup/interfaces/IAction.js";
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";
import { cryptoService } from "@/core/services/CryptoService.js";

class GenerateAppKeyAction implements IAction {

    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any> {
        const answerIsYes = question.getAnswer() === 'y' || question.getAnswer() === 'yes';

        if(!answerIsYes) {
            return;
        }

        const appKey = cryptoService().generateAppKey()

        await ref.env.updateValues({ APP_KEY: appKey });

        ref.writeLine('Successfully generated app key!');
    }

}

export default GenerateAppKeyAction