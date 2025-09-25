import { AbstractMiddlewareException } from "../base/AbstractMiddlewareException.js";

export class ResourceNotFoundException extends AbstractMiddlewareException {
    code = 404;

    constructor(message: string) {
        super(message);
        this.name = 'ResourceNotFoundException';
    }

}