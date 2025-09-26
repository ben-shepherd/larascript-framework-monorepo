import { AbstractHttpException } from "../base/AbstractHttpException.js";

class SecurityException extends AbstractHttpException {
    code = 403;

    constructor(message: string) {
        super(message);
        this.name = 'SecurityException';
    }

}

export default SecurityException;