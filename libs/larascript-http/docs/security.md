## Security

Attach security rules to routes. Security is enforced by `SecurityMiddleware` and applied automatically when `security` is non-empty.

```ts
const router = new HttpRouter();

router.post('/posts', [PostsController, 'create'], {
  security: [
    router.security().hasRole(['admin', 'editor']),
    router.security().scopes('posts.write'),
    router.security().rateLimited(100, 1)
  ]
});

router.resource({
  prefix: '/posts',
  datasource: PostRepository,
  security: [router.security().resourceOwner('userId')]
});
```

Available rules:
- `hasRole(roles)`
- `scopes(scopes, exactMatch = true)`
- `resourceOwner(attribute = 'userId')`
- `rateLimited(limit, perMinuteAmount)`

Security from parent groups is merged with child routes. Rules can be found and evaluated per action type during resource routing.


