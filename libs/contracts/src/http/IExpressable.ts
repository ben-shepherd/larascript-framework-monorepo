import { TRouteItem } from "./index.js";

export interface IExpressable<T = unknown> {
    // eslint-disable-next-line no-unused-vars
    toExpressable(routeItem?: TRouteItem): T
}