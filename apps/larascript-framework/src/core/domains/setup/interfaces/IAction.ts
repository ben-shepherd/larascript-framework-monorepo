/* eslint-disable no-unused-vars */
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";

export type ActionCtor<T extends IAction = IAction> = new (...args: any[]) => T;

export interface IAction {
    handle: (ref: ISetupCommand, ...args: any[]) => Promise<any>;
}