import SecurityException from "@/core/domains/express/exceptions/SecurityException.js";
import HttpContext from "@/core/domains/http/context/HttpContext.js";
import { SecurityEnum } from "@/core/domains/http/enums/SecurityEnum.js";
import AbstractSecurityRule from "@/core/domains/http/security/abstract/AbstractSecurityRule.js";
import { auth } from "@/core/services/AuthService.js";
import { UnauthorizedException } from "@larascript-framework/larascript-auth";

type TEnableScopeRuleOptions = {
    scopes: string | string[];
    exactMatch: boolean
}

class ScopeRule extends AbstractSecurityRule<TEnableScopeRuleOptions> {

    protected readonly id = SecurityEnum.ENABLE_SCOPES;
    
    protected conditionsNotSupported: boolean = true;

    public async execute(context: HttpContext): Promise<boolean> {

        if(!await auth().check()) {
            throw new UnauthorizedException();
        }

        const apiToken = context.getApiToken();

        if(!apiToken) {
            return false;
        }

        const scopes = this.getRuleOptions().scopes;

        if(!scopes) {
            throw new SecurityException('Scopes are required');
        }

        const scopesArr = Array.isArray(scopes) ? scopes : [scopes];

        if(scopesArr.length === 0) {
            throw new SecurityException('No scopes provided');
        }
        
        const exactMatch = this.getRuleOptions().exactMatch;

        return apiToken.hasScope(scopesArr, exactMatch);
    }

}

export default ScopeRule;