import { BaseSingleton } from "@larascript-framework/larascript-core";
import readline, { createInterface } from "node:readline";
import { ICommandConstructor } from "../interfaces/ICommand";
import ICommandService from "../interfaces/ICommandService";
import CommandReader from "./CommandReader";
import CommandRegister from "./CommandRegister";

/**
 * ConsoleService class that implements the ICommandService interface.
 * This class provides methods for creating command readers and registering commands.
 */
export class ConsoleService
  extends BaseSingleton
  implements ICommandService
{
  protected readlineInterface: readline.Interface;

  constructor() {
    super(null);
    this.readlineInterface = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Returns a singleton instance of the CommandReader class.
   * @param argv The arguments to pass to the command reader.
   * @returns CommandReader
   */
  public readerService(argv: string[]): CommandReader {
    return new CommandReader(argv);
  }

  /**
   * Returns a singleton instance of the CommandRegister class.
   * @returns CommandRegister
   */
  public registerService(): CommandRegister {
    return CommandRegister.getInstance();
  }

  /**
   * Registers a new command.
   * @param cmdCtor The command to register.
   * @param config The configuration for the commands.
   */
  public register(cmdCtor: ICommandConstructor, config?: object) {
    return this.registerService().register(cmdCtor, config);
  }

  /**
   * Returns the readline interface.
   * @returns readline.Interface
   */
  public readline(): readline.Interface {
    return this.readlineInterface;
  }
}

export default ConsoleService;