import { AbstractMiddlewareException } from "../base/AbstractMiddlewareException.js";

export class ForbiddenResourceError extends AbstractMiddlewareException {
    code = 403;

    constructor(
      message: string = "You do not have permission to access this resource",
    ) {
      super(message);
      this.name = "ForbiddenResourceError";
    }
  }
  