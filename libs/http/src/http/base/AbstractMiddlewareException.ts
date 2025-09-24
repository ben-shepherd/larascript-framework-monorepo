export abstract class AbstractMiddlewareException extends Error {
    abstract code: number;
}