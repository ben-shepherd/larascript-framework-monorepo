/* eslint-disable no-undef */
import CopyEnvExampleAction from '@/core/domains/setup/actions/CopyEnvExampleAction.js';
import GenerateAppKeyAction from '@/core/domains/setup/actions/GenerateAppKeyAction.js';
import GenerateJwtSecretAction from '@/core/domains/setup/actions/GenerateJwtSecretAction.js';
import SetupDockerDatabaseScripts from '@/core/domains/setup/actions/SetupDockerDatabaseScripts.js';
import AppSetupCommand from '@/core/domains/setup/commands/AppSetupCommand.js';
import { QuestionIDs } from '@/core/domains/setup/consts/QuestionConsts.js';
import QuestionDTO from '@/core/domains/setup/DTOs/QuestionDTO.js';
import { IAction } from '@/core/domains/setup/interfaces/IAction.js';
import { ISetupCommand } from '@/core/domains/setup/interfaces/ISetupCommand.js';
import { SetupService } from '@/core/domains/setup/providers/SetupService.js';
import buildQuestionDTOs from '@/core/domains/setup/utils/buildQuestionDTOs.js';
import { clearOutputFiles } from '@/tests/larascript/test-helper/clearOutputFiles.js';
import { getOutputPath } from '@/tests/larascript/test-helper/getOutputPath.js';
import testHelper from '@/tests/testHelper.js';
import { describe } from '@jest/globals';
import fs from 'fs';

describe('describe your test', () => {
    let questionDTOs: QuestionDTO[];
    let setupCommand: ISetupCommand;
    let userQuestion: QuestionDTO;

    beforeAll(async () => {
        clearOutputFiles();

        await testHelper.testBootApp();

        questionDTOs = buildQuestionDTOs();
        setupCommand = new AppSetupCommand();
    })

    beforeEach(() => {
        clearOutputFiles();

        // Create the .env.example file
        fs.writeFileSync(getOutputPath('.env.example'),
            `TEST_ENV=test
                DATABASE_DEFAULT_CONNECTION=
                DATABASE_POSTGRES_CONNECTION=
                DATABASE_POSTGRES_URI=
                DATABASE_MONGODB_CONNECTION=
                DATABASE_MONGODB_URI=
                `);
        // Copy the .env.example file to .env
        fs.copyFileSync(getOutputPath('.env.example'), getOutputPath('.env'));

        // Create the package.json file
        fs.writeFileSync(getOutputPath('package.json'), JSON.stringify({
            name: 'test',
            version: '1.0.0',
            scripts: {
                test: 'echo "test"'
            },
            dependencies: {
                'larascript-framework': 'latest'
            }
        }));
    })

    describe("copyEnvExample action", () => {
        test("should copy the .env.example file to .env", async () => {

            // Delete the .env file if it exists
            if (fs.existsSync(getOutputPath('.env'))) {
                fs.unlinkSync(getOutputPath('.env'));
            }

            const questionDTO = questionDTOs.find(questionDTO => questionDTO.id === QuestionIDs.copyEnvExample);
            const actionConstructor = questionDTO?.actionCtor as new () => IAction;

            expect(questionDTO).toBeDefined();
            expect(questionDTO?.actionCtor).toBe(CopyEnvExampleAction);

            const action = new actionConstructor();
            await action.handle(setupCommand);

            expect(fs.existsSync(getOutputPath('.env'))).toBe(true);
            expect(fs.readFileSync(getOutputPath('.env'), 'utf8')).toContain('TEST_ENV=test');
        });
    })

    describe("appKey action", () => {
        test("should generate a new app key", async () => {

            // Create the .env file
            fs.writeFileSync(getOutputPath('.env'), 'APP_KEY=');

            const questionDTO = questionDTOs.find(questionDTO => questionDTO.id === QuestionIDs.appKey);
            const actionConstructor = questionDTO?.actionCtor as new () => IAction;

            userQuestion = QuestionDTO.createYesQuestionDTO(QuestionIDs.appKey)
                .withQuestionDTO(questionDTO!);

            expect(questionDTO).toBeDefined();
            expect(questionDTO?.actionCtor).toBe(GenerateAppKeyAction);

            const action = new actionConstructor();
            await action.handle(setupCommand, userQuestion);

            expect(fs.existsSync(getOutputPath('.env'))).toBe(true);
            expect(fs.readFileSync(getOutputPath('.env'), 'utf8')).toContain('APP_KEY=');
        });
    });

    describe("jwtSecret action", () => {
        test("should generate a new jwt secret", async () => {

            // Create the .env file
            fs.writeFileSync(getOutputPath('.env'), 'JWT_SECRET=');

            const questionDTO = questionDTOs.find(questionDTO => questionDTO.id === QuestionIDs.jwtSecret);
            const actionConstructor = questionDTO?.actionCtor as new () => IAction;

            userQuestion = QuestionDTO.createYesQuestionDTO(QuestionIDs.jwtSecret)
                .withQuestionDTO(questionDTO!);

            expect(questionDTO).toBeDefined();
            expect(questionDTO?.actionCtor).toBe(GenerateJwtSecretAction);

            const action = new actionConstructor();
            await action.handle(setupCommand, userQuestion);

            expect(fs.existsSync(getOutputPath('.env'))).toBe(true);
            expect(fs.readFileSync(getOutputPath('.env'), 'utf8')).toContain('JWT_SECRET=');
        });
    });

    describe("selectDb action", () => {
        test("should select mongodb as a database", async () => {
            const questionDTO = questionDTOs.find(questionDTO => questionDTO.id === QuestionIDs.selectDb);
            const actionConstructors = questionDTO?.actionCtors as unknown as new () => IAction[];

            userQuestion = QuestionDTO.createWithAnswer(QuestionIDs.selectDb, 'mongodb')

            expect(questionDTO).toBeDefined();
            expect(actionConstructors[0]).toBe(SetupDockerDatabaseScripts);

            const actionSetupDockerDatabaseScripts = new actionConstructors[0]();
            await actionSetupDockerDatabaseScripts.handle(setupCommand, userQuestion);

            const packageJson = SetupService.getInstance().getPackageJsonService().getJsonSync();

            expect(packageJson.scripts['db:up']).toBe('npm db:mongodb:up');
            expect(packageJson.scripts['db:down']).toBe('npm db:mongodb:down');

            const actionSetupDefaultDatabase = new actionConstructors[1]();
            await actionSetupDefaultDatabase.handle(setupCommand, userQuestion);

            const envContents = fs.readFileSync(getOutputPath('.env'), 'utf8');

            expect(envContents).toContain('DATABASE_DEFAULT_CONNECTION=mongodb');
            expect(envContents).toContain('DATABASE_MONGODB_CONNECTION=mongodb');
            expect(envContents).toContain('DATABASE_MONGODB_URI=mongodb://root:example@localhost:27017/app?authSource=admin');
        });

        test("should select postgres as a database", async () => {
            const questionDTO = questionDTOs.find(questionDTO => questionDTO.id === QuestionIDs.selectDb);
            const actionConstructors = questionDTO?.actionCtors as unknown as new () => IAction[];

            userQuestion = QuestionDTO.createWithAnswer(QuestionIDs.selectDb, 'postgres')

            expect(questionDTO).toBeDefined();
            expect(actionConstructors[0]).toBe(SetupDockerDatabaseScripts);

            const actionSetupDockerDatabaseScripts = new actionConstructors[0]();
            await actionSetupDockerDatabaseScripts.handle(setupCommand, userQuestion);

            const packageJson = SetupService.getInstance().getPackageJsonService().getJsonSync();

            expect(packageJson.scripts['db:up']).toBe('npm db:postgres:up');
            expect(packageJson.scripts['db:down']).toBe('npm db:postgres:down');

            const actionSetupDefaultDatabase = new actionConstructors[1]();
            await actionSetupDefaultDatabase.handle(setupCommand, userQuestion);

            const envContents = fs.readFileSync(getOutputPath('.env'), 'utf8');

            expect(envContents).toContain('DATABASE_DEFAULT_CONNECTION=postgres');
            expect(envContents).toContain('DATABASE_POSTGRES_CONNECTION=postgres');
            expect(envContents).toContain('DATABASE_POSTGRES_URI=postgres://root:example@localhost:5432/app');
        });

        test("should select all databases", async () => {
            const questionDTO = questionDTOs.find(questionDTO => questionDTO.id === QuestionIDs.selectDb);
            const actionConstructors = questionDTO?.actionCtors as unknown as new () => IAction[];

            userQuestion = QuestionDTO.createWithAnswer(QuestionIDs.selectDb, 'all')

            expect(questionDTO).toBeDefined();
            expect(actionConstructors[0]).toBe(SetupDockerDatabaseScripts);

            const actionSetupDockerDatabaseScripts = new actionConstructors[0]();
            await actionSetupDockerDatabaseScripts.handle(setupCommand, userQuestion);

            const packageJson = SetupService.getInstance().getPackageJsonService().getJsonSync();

            expect(packageJson.scripts['db:up']).toContain('npm db:postgres:up');
            expect(packageJson.scripts['db:up']).toContain('npm db:mongodb:up');
            expect(packageJson.scripts['db:down']).toContain('npm db:postgres:down');
            expect(packageJson.scripts['db:down']).toContain('npm db:mongodb:down');

            const actionSetupDefaultDatabase = new actionConstructors[1]();
            await actionSetupDefaultDatabase.handle(setupCommand, userQuestion);

            const envContents = fs.readFileSync(getOutputPath('.env'), 'utf8');

            expect(envContents).toContain('DATABASE_DEFAULT_CONNECTION=postgres');
            expect(envContents).toContain('DATABASE_POSTGRES_CONNECTION=postgres');
            expect(envContents).toContain('DATABASE_POSTGRES_URI=postgres://root:example@localhost:5432/app');
            expect(envContents).toContain('DATABASE_MONGODB_CONNECTION=mongodb');
            expect(envContents).toContain('DATABASE_MONGODB_URI=mongodb://root:example@localhost:27017/app?authSource=admin');
        });
    });
})