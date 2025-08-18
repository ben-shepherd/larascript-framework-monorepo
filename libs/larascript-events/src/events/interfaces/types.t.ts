/* eslint-disable no-unused-vars */
export interface IDispatchable
{
    dispatch(...args: unknown[]): Promise<unknown>;
}

export interface IExecutable
{
    execute(...args: any[]): Promise<void>;
}

export interface INameable {
    getName(): string;
}