 
import { IBaseEvent } from "@larascript-framework/larascript-events";
import { app } from "@src/core/services/App";

export const events = () => app('events');

export const dispatch = (event: IBaseEvent) => events().dispatch(event);
