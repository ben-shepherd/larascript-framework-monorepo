import { IHttpContext } from "@larascript-framework/contracts/http";
import { AbstractRule, ValidatorException } from "@larascript-framework/larascript-validator";

/**
 * Abstract rule with HTTP context
 */
abstract class AbstractRuleHttpContext<TOptions extends object = object> extends AbstractRule<TOptions> {

    getHttpContext(): IHttpContext {
        if(typeof this.getContext<IHttpContext>("httpContext") === "undefined") {
            throw new ValidatorException("httpContext context has not been set")
        }

        return this.getContext<IHttpContext>("httpContext")!
    }

}


export default AbstractRuleHttpContext