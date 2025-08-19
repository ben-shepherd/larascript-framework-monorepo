import { BaseDriver } from "../base/BaseDriver";
import { IBaseEvent } from "../interfaces/base.t";

export class SyncDriver extends BaseDriver  {

    async dispatch(event: IBaseEvent): Promise<void> {
        await event.execute();
    }
    
}