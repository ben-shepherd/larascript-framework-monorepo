
import SecurityException from "@/core/domains/express/exceptions/SecurityException.js";
import HttpContext from "@/core/domains/http/context/HttpContext.js";
import { SecurityEnum } from "@/core/domains/http/enums/SecurityEnum.js";
import AbstractSecurityRule from "@/core/domains/http/security/abstract/AbstractSecurityRule.js";

type THasRoleRuleOptions = {
    roles: string | string[];
}

class HasRoleRule extends AbstractSecurityRule<THasRoleRuleOptions> {

    protected readonly id = SecurityEnum.HAS_ROLE;

    async execute(context: HttpContext): Promise<boolean> {
        const user = context.getUser();

        if(!user) {
            return false;
        }

        const roles = this.getRuleOptions().roles;

        if(!roles) {
            throw new SecurityException('Roles are required');
        }

        const rolesArr = Array.isArray(roles) ? roles : [roles];

        if(rolesArr.length === 0) {
            throw new SecurityException('No roles provided');
        }

        return user.getAclRoles()?.some(role => rolesArr.includes(role)) ?? false;
    }

}

export default HasRoleRule;