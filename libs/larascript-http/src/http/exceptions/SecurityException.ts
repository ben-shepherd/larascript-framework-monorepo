import { AbstractMiddlewareException } from "../base/AbstractMiddlewareException.js";

class SecurityException extends AbstractMiddlewareException {
    code = 403;

    constructor(message: string) {
        super(message);
        this.name = 'SecurityException';
    }

}

export default SecurityException;