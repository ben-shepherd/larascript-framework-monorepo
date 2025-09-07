 
import BaseMakeFileCommand from '@/core/domains/make/base/BaseMakeFileCommand.js';
import MakeCmdCommand from '@/core/domains/make/commands/MakeCmdCommand.js';
import MakeController from '@/core/domains/make/commands/MakeControllerCommand.js';
import MakeFactoryCommand from '@/core/domains/make/commands/MakeFactoryCommand.js';
import MakeListenerCommand from '@/core/domains/make/commands/MakeListenerCommand.js';
import MakeMiddlewareCommand from '@/core/domains/make/commands/MakeMiddlewareCommand.js';
import MakeMigrationCommand from '@/core/domains/make/commands/MakeMigrationCommand.js';
import MakeModelCommand from '@/core/domains/make/commands/MakeModelCommand.js';
import MakeObserverCommand from '@/core/domains/make/commands/MakeObserverCommand.js';
import MakeProviderCommand from '@/core/domains/make/commands/MakeProviderCommand.js';
import MakeRepositoryCommand from '@/core/domains/make/commands/MakeRepositoryCommand.js';
import MakeRouteResourceCommand from '@/core/domains/make/commands/MakeRouteResourceCommand.js';
import MakeRoutesCommand from '@/core/domains/make/commands/MakeRoutesCommand.js';
import MakeSeederCommand from '@/core/domains/make/commands/MakeSeederCommand.js';
import MakeServiceCommand from '@/core/domains/make/commands/MakeServiceCommand.js';
import MakeSingletonCommand from '@/core/domains/make/commands/MakeSingletonCommand.js';
import MakeSubscriberCommand from '@/core/domains/make/commands/MakeSubscriberCommand.js';
import MakeValidatorCommand from '@/core/domains/make/commands/MakeValidatorCommand.js';
import { targetDirectories } from '@/core/domains/make/consts/MakeTypes.js';
import { KeyPair, ParsedArgumentsArray } from '@larascript-framework/larascript-console';

// eslint-disable-next-line no-unused-vars
export type CommandCtor<T extends BaseMakeFileCommand = BaseMakeFileCommand> = new (...args: any[]) => T;

/**
 * Get array of command types
 * e.g. Provider, Model, Repository etc.
 * 
 * @returns 
 */
const getArrayOfCommandTypes = (): string[] => {
    return Object.keys(targetDirectories)
}

/**
 * Generate parsed arguments
 * 
 * @param fileName 
 * @param collectionName 
 * @returns 
 */
const getParsedArguments = (fileName: string, collectionName: string): ParsedArgumentsArray => {
    return [
        {
            type: KeyPair,
            key: 'name',   
            value: fileName
        },
        {
            type: KeyPair,
            key: 'collection',   
            value: collectionName
        }
    ];
}

/**
 * Get command constructor by type
 * 
 * @param type 
 * @returns 
 */
const getCommandCtorByType = (type: typeof targetDirectories[string]): CommandCtor<BaseMakeFileCommand> => {
    switch(type) {
    case 'Repository':
        return MakeRepositoryCommand;
    case 'Model':
        return MakeModelCommand;
    case 'Listener':
        return MakeListenerCommand;
    case 'Subscriber':
        return MakeSubscriberCommand;
    case 'Service':
        return MakeServiceCommand;
    case 'Singleton':
        return MakeSingletonCommand;
    case 'Command':
        return MakeCmdCommand;
    case 'Observer':
        return MakeObserverCommand;
    case 'Provider':
        return MakeProviderCommand;
    case 'Routes':
        return MakeRoutesCommand;
    case 'Middleware':
        return MakeMiddlewareCommand;
    case 'Controller':
        return MakeController;
    case 'Validator':
        return MakeValidatorCommand;
    case 'Migration':
        return MakeMigrationCommand;
    case 'Seeder':
        return MakeSeederCommand;
    case 'Factory':
        return MakeFactoryCommand;
    case 'RouteResource':
        return MakeRouteResourceCommand;
    default:
        throw new Error(`Unknown command type '${type}'`)
    }
}

export default Object.freeze({
    getArrayOfCommandTypes,
    getParsedArguments,
    getCommandCtorByType
});