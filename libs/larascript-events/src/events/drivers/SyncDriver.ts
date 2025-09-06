import { BaseDriver } from "../base/BaseDriver";
import { EVENT_DRIVERS } from "../consts/drivers";
import { IBaseEvent } from "../interfaces/base.t";

/**
 * SyncDriver class.
 * 
 * A driver that handles event dispatching by executing events immediately.
 * This driver is useful for events that need to be processed synchronously.
 * 
 * @class SyncDriver
 * @extends BaseDriver
 */
export class SyncDriver extends BaseDriver  {

    _type: keyof typeof EVENT_DRIVERS = EVENT_DRIVERS.SYNC as keyof typeof EVENT_DRIVERS;

    async dispatch(event: IBaseEvent): Promise<void> {
        await event.execute();
    }
    
}

export default SyncDriver;