/* eslint-disable no-undef */
import CopyEnvExampleAction from '@/core/domains/setup/actions/CopyEnvExampleAction.js';
import AppSetupCommand from '@/core/domains/setup/commands/AppSetupCommand.js';
import { QuestionIDs } from '@/core/domains/setup/consts/QuestionConsts.js';
import QuestionDTO from '@/core/domains/setup/DTOs/QuestionDTO.js';
import { IAction } from '@/core/domains/setup/interfaces/IAction.js';
import { ISetupCommand } from '@/core/domains/setup/interfaces/ISetupCommand.js';
import buildQuestionDTOs from '@/core/domains/setup/utils/buildQuestionDTOs.js';
import { getOutputPath } from '@/tests/larascript/test-helper/getOutputPath.js';
import { resetOutput } from '@/tests/larascript/test-helper/resetOutut.js';
import testHelper from '@/tests/testHelper.js';
import { describe } from '@jest/globals';
import fs from 'fs';

describe('describe your test', () => {
    let questionDTOs: QuestionDTO[];
    let setupCommand: ISetupCommand;

    beforeAll(async () => {
        resetOutput();

        await testHelper.testBootApp();

        questionDTOs = buildQuestionDTOs();
        setupCommand = new AppSetupCommand();

        // Create the .env.example file
        fs.writeFileSync(getOutputPath('.env.example'), 'TEST_ENV=test');
    })

    describe("copyEnvExample action", () => {
        test("should copy the .env.example file to .env", async () => {
            const questionDTO = questionDTOs.find(questionDTO => questionDTO.id === QuestionIDs.copyEnvExample);
            const actionConstructor = questionDTO?.actionCtor as new () => IAction;

            expect(questionDTO).toBeDefined();
            expect(questionDTO?.actionCtor).toBe(CopyEnvExampleAction);

            const action = new actionConstructor();
            await action.handle(setupCommand);

            expect(fs.existsSync(getOutputPath('.env'))).toBe(true);
            expect(fs.readFileSync(getOutputPath('.env'), 'utf8')).toBe('TEST_ENV=test');
        });
    })
})