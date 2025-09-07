/* eslint-disable no-unused-vars */
import HttpContext from "@/core/domains/http/context/HttpContext.js"
import { TRouteItem } from "@/core/domains/http/interfaces/IRouter.js"

export interface ControllerConstructor {
    new (context: HttpContext): IController
    executeAction(action: string, context: HttpContext): Promise<void>
}

export interface IController {
    setContext(context: HttpContext): void
    getRouteOptions(): TRouteItem | undefined
}