## Routes

Define routes with the router or the `Route` facade.

```ts
import HttpRouter from '@/http/router/HttpRouter';
import Route from '@/http/router/Route';
import UsersController from '@/http/controllers/UsersController';

const router = new HttpRouter();

// Basic routes
router.get('/health', UsersController );
router.post('/users', UsersController );

// Grouped routes (prefix, shared middleware, security, etc.)
router.group({ prefix: '/api', middlewares: [] }, (r) => {
  r.get('/users', UsersController );
  r.get('/users/:id', UsersController );
});

// Using the Route facade
Route.group({ prefix: '/v1' }, (r) => {
  r.get('/status', UsersController );
});

// Using a specific controller method
router.get('/users', [UsersController, 'users'] );

// Use an express function
router.get('/users', (req, res) => {
  res.send('Hello World');
});

// Individual options per route
router.get('/users', UsersController, {
  middlewares: [
    AuthenticationMiddleware,
  ],
  security: [
    router.security().rateLimited(100, 1),
  ]
});
```

### Options
- **name**: route name
- **prefix**: path prefix (also available via `group`)
- **middlewares**: function/class middlewares
- **controller**: controller class for `'action'` methods
- **security**: array of security rules
- **validator**: request validator(s)
- **config**: arbitrary per-route config

HTTP methods available: `get`, `post`, `put`, `patch`, `delete`.


