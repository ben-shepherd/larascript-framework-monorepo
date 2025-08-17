import { HasConfigConcern } from "@/concerns/HasConfigConcern";
import { compose } from "@larascript-framework/larascript-utils";

export class BaseConfig extends compose(class {}, HasConfigConcern) {
  declare getConfig: <T = unknown>() => T;

  declare setConfig: (config: unknown) => void;
}
