import { EnvironmentType } from "./EnvironmentType.t.js";
import { IProvider } from "./Provider.t.js";

export type KernelOptions = {
    withoutProvider?: string[];
};
export type KernelConfig = {
    environment: EnvironmentType;
    providers: IProvider[];
};