import QuestionData from "@/core/domains/setup/DTOs/QuestionData.js";
import { IAction } from "@/core/domains/setup/interfaces/IAction.js";
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";
import { isTruthy } from "@larascript-framework/larascript-validator";

class GenerateJwtSecretAction implements IAction {

    async handle(ref: ISetupCommand, question: QuestionData): Promise<any> {
        const answer = question.getUserAnswerOrDefaultAnswer();
        let value: string = isTruthy(answer) ? 'true' : 'false'

        if(value === 'false') {
            return;
        }

        const secret = require('crypto').randomBytes(64).toString('hex');

        await ref.env.updateValues({ JWT_SECRET: secret });

        ref.writeLine('Successfully generated jwt secret!');
    }

}

export default GenerateJwtSecretAction