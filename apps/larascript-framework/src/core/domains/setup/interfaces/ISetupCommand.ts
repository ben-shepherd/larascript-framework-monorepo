/* eslint-disable no-unused-vars */
import { IEnvService } from "@larascript-framework/larascript-core";
import { IConsoleInputService } from '@src/core/domains/console/interfaces/IConsoleInputService';

export interface ISetupCommand {
    env: IEnvService;
    input: IConsoleInputService;
    writeLine(line: string): void;
}