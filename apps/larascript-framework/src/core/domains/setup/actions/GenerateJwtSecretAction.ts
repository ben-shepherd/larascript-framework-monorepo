import QuestionDTO from "@/core/domains/setup/DTOs/QuestionDTO.js";
import { IAction } from "@/core/domains/setup/interfaces/IAction.js";
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";

class GenerateJwtSecretAction implements IAction {

    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any> {
        const answerIsYes = question.getAnswer() === 'y' || question.getAnswer() === 'yes';

        if(!answerIsYes) {
            return;
        }

        const secret = require('crypto').randomBytes(64).toString('hex');

        await ref.env.updateValues({ JWT_SECRET: secret });

        ref.writeLine('Successfully generated jwt secret!');
    }

}

export default GenerateJwtSecretAction