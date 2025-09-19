import QuestionData from "@/core/domains/setup/DTOs/QuestionData.js";
import { IAction } from "@/core/domains/setup/interfaces/IAction.js";
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";
import { isTruthy } from "@larascript-framework/larascript-validator";

class AuthEnableRoutes implements IAction {

    async handle(ref: ISetupCommand, question: QuestionData): Promise<void> {
        const answer = question.getUserAnswerOrDefaultAnswer()
        let value: string = isTruthy(answer) ? 'true' : 'false'

        if(value === 'false') {
            value = 'false';
        }

        await ref.env.updateValues({ ENABLE_AUTH_ROUTES: value });
    }

}

export default AuthEnableRoutes