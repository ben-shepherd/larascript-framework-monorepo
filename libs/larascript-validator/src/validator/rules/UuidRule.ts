import { isUuid } from "@repo/larascript-utils";
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class UuidRule extends AbstractRule<object> implements IRule {
  protected name: string = "uuid";

  protected errorTemplate: string =
    "The :attribute field must be a valid UUID.";

  constructor() {
    super();
    this.options = {};
  }

  public async test(): Promise<boolean> {
    return isUuid(this.getAttributeData());
  }

  getError(): IRuleError {
    return {
      [this.getDotNotationPath()]: [this.formatErrorMessage({})],
    };
  }
}

export default UuidRule;
