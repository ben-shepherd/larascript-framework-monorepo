import { ICommandConstructor } from '@larascript-framework/larascript-console';
import ExampleCommand from '@src/app/commands/ExampleCommand';

/**
 * Register your custom commands here.
 * Commands will be available through the CLI using:
 * yarn dev <command-name> --args
 */
const commandsConfig: ICommandConstructor[] = [
    ExampleCommand,
]

export default commandsConfig;
