import { BaseDriver } from "@larascript-framework/larascript-events";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";

class SyncDriver extends BaseDriver  {

    async dispatch(event: IBaseEvent): Promise<void> {
        await event.execute();
    }
    
}

export default SyncDriver