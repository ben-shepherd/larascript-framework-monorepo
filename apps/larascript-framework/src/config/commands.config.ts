import ExampleCommand from '@/app/commands/ExampleCommand.js';
import { ICommandConstructor } from '@larascript-framework/larascript-console';

/**
 * Register your custom commands here.
 * Commands will be available through the CLI using:
 * yarn dev <command-name> --args
 */
const commandsConfig: ICommandConstructor[] = [
    ExampleCommand,
]

export default commandsConfig;
