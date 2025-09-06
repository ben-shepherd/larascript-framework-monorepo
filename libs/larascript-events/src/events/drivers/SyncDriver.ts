import { BaseDriver } from "../base/BaseDriver";
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

    async dispatch(event: IBaseEvent): Promise<void> {
        await event.execute();
    }
    
}

export default SyncDriver;