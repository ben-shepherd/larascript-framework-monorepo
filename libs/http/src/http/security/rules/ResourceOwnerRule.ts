import HttpContext from "@/http/context/HttpContext.js";
import { SecurityEnum } from "@/http/enums/SecurityEnum.js";
import ResourceException from "@/http/exceptions/ResourceException.js";
import { RouteResourceTypes } from "@/http/router/RouterResource.js";
import { IModel } from "@larascript-framework/contracts/database/model";
import AbstractSecurityRule from "../abstract/AbstractSecurityRule.js";

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