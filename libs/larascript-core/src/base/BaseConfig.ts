import { compose } from "@larascript-framework/larascript-utils";
import { HasConfigConcern } from "../concerns/HasConfigConcern";

export class BaseConfig extends compose(class {}, HasConfigConcern) {
  declare getConfig: <T = unknown>() => T;

  declare setConfig: (config: unknown) => void;
}
