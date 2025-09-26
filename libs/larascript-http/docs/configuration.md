## Configuration

Base HTTP config shows defaults and extension points.

```ts
import { baseConfig } from '@/http/config/base.config';

// baseConfig:
// - enabled: boolean
// - port: number
// - beforeAllMiddlewares: (Express or class)[] (e.g., cors())
// - afterAllMiddlewares: (Express or class)[]
// - extendExpress(app): hook to extend express (file uploads, etc.)
// - csrf: {}
// - logging: {}
```

Binding routes with global middleware hooks:
```ts
import HttpService from '@/http/services/HttpService';
import HttpRouter from '@/http/router/HttpRouter';

const http = new HttpService({
  enabled: true,
  port: 3000,
  beforeAllMiddlewares: [],
  afterAllMiddlewares: [],
});

const router = new HttpRouter();
// define routes...
http.bindRoutes(router);
await http.listen();
```


