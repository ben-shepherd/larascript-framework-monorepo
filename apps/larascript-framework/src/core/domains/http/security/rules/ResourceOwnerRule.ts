
import ResourceException from "@/core/domains/express/exceptions/ResourceException.js";
import HttpContext from "@/core/domains/http/context/HttpContext.js";
import { SecurityEnum } from "@/core/domains/http/enums/SecurityEnum.js";
import { RouteResourceTypes } from "@/core/domains/http/router/RouterResource.js";
import AbstractSecurityRule from "@/core/domains/http/security/abstract/AbstractSecurityRule.js";
import { IModel } from "@larascript-framework/larascript-database";

type TResourceOwnerRuleOptions = {
    attribute: string;
}

export type TRouteResourceTypes = (typeof RouteResourceTypes)[keyof typeof RouteResourceTypes]

class ResourceOwnerRule extends AbstractSecurityRule<TResourceOwnerRuleOptions, TRouteResourceTypes, TRouteResourceTypes> {

    protected readonly id = SecurityEnum.RESOURCE_OWNER;

    async execute(context: HttpContext, resource: IModel): Promise<boolean> {
        const user = context.getUser();

        if(!user) {
            return false;
        }
        
        const attribute = this.getRuleOptions().attribute;

        if(!attribute) {
            throw new ResourceException('Attribute is required');
        }
    
        return resource.getAttributeSync(attribute) === user?.getId()
    }

}

export default ResourceOwnerRule;