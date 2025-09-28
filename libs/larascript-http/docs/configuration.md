## Configuration

The HTTP configuration is used to configure the HTTP service.

- `enabled`: boolean
- `port`: number
- `beforeAllMiddlewares`: (Express or class)[]
- `afterAllMiddlewares`: (Express or class)[]
- `extendExpress`: (app: express.Application) => void
- `logging`: {
    requests: boolean,
}

### Example

```ts
import { IHttpServiceConfig } from '@larascript-framework/contracts/http';
import { HttpEnvironment, HttpService } from '@larascript-framework/larascript-http';

export const config: IHttpServiceConfig = {
    enabled: true,
    port: 0, // Use dynamic port allocation
    beforeAllMiddlewares: [],
    afterAllMiddlewares: [],
    extendExpress: () => {},
    logging: {
        requests: true,
    },
}

await HttpEnvironment.create(
    new HttpService(config)
).boot();
```


