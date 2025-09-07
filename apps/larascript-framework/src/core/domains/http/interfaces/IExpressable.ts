import { TRouteItem } from "@/core/domains/http/interfaces/IRouter.js";

export interface IExpressable<T = unknown> {
    // eslint-disable-next-line no-unused-vars
    toExpressable(routeItem?: TRouteItem): T
}