import { AbstractMiddlewareException } from "../base/AbstractMiddlewareException.js";

export class RateLimitedExceededError extends AbstractMiddlewareException {
    code = 429;
    
    constructor(message: string = "Too many requests. Try again later.") {
      super(message);
      this.name = "RateLimitedExceededError";
    }
  }
  