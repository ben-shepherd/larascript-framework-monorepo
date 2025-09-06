import { AppSingleton } from "../../../app/AppSingleton";
import { TestContainers } from "../providers/providers";

export const testApp = <K extends keyof TestContainers>(name: K) =>
  AppSingleton.container<TestContainers>(name) as TestContainers[K];
