import { DependencyLoader } from "@/interfaces/Dependency.t.js";

export type TestContainers = {
    example: string;
    object: {
      value: 1;
    };
    logger: {
      log: (message: string) => void;
      clear: () => void;
      containsLog: (message: string) => boolean;
    };
    database: {
      setDependencyLoader: (loader: DependencyLoader) => void;
      connect: () => Promise<boolean>;
      reset: () => void;
    };
  };