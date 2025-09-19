import QuestionData from "@/core/domains/setup/DTOs/QuestionData.js";
import { IAction } from "@/core/domains/setup/interfaces/IAction.js";
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";
import { cryptoService } from "@/core/services/CryptoService.js";
import { isTruthy } from "@larascript-framework/larascript-validator";

class GenerateAppKeyAction implements IAction {

    async handle(ref: ISetupCommand, question: QuestionData): Promise<any> {
        const answer = question.getUserAnswerOrDefaultAnswer();
        let value: string = isTruthy(answer) ? 'true' : 'false'

        if(value === 'false') {
            return;
        }

        const appKey = cryptoService().generateAppKey()

        await ref.env.updateValues({ APP_KEY: appKey });

        ref.writeLine('Successfully generated app key!');
    }

}

export default GenerateAppKeyAction