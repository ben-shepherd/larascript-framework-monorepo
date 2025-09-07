import QuestionDTO from "@/core/domains/setup/DTOs/QuestionDTO.js";
import { IAction } from "@/core/domains/setup/interfaces/IAction.js";
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";

class EnableExpress implements IAction {

    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any> {
        const answerIsEnabled = question.getAnswer() === 'y' || question.getAnswer() === 'yes';

        ref.env.updateValues({ EXPRESS_ENABLED: answerIsEnabled ? 'true' : 'false' });
    }

}

export default EnableExpress