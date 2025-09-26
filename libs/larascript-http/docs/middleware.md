## Middleware

Apply middleware globally, per group, or per route. Middlewares can be Express handlers or classes extending `Middleware`.

```ts
import Middleware from '@/http/base/Middleware';

class AuthMiddleware extends Middleware {
  async execute(ctx) {
    // ... auth checks
    this.next();
  }
}

router.group({ prefix: '/api', middlewares: [AuthMiddleware] }, (r) => {
  r.get('/me', 'show', { controller: MeController });
});

r.post('/upload', 'create', {
  controller: UploadController,
  middlewares: [AuthMiddleware]
});
```

Order of execution:
1. Global before-all middlewares (from config)
2. Route/group middlewares
3. Global after-all middlewares (from config)
4. Route handler


