import ConfigException from "../exceptions/ConfigException.js";
import Http from "../services/Http.js";
import Middleware from "./Middleware.js";

export abstract class AbstractAuthMiddleware<Config extends unknown = unknown> extends Middleware<Config> {

    constructor() {
        super();
        if (!Http.getInstance().isAuthConfigured()) {
            throw new ConfigException('Auth service not configured');
        }
    }

}
