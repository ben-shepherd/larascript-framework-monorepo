import { AbstractMiddlewareException } from "../base/AbstractMiddlewareException.js";

export class UnauthorizedException extends AbstractMiddlewareException {
    code = 401;

  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizeError";
  }
}
