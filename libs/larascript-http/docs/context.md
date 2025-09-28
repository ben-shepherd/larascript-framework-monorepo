## Http Context

`HttpContext` wraps Express `req`, `res`, and the current route. Use it inside controllers and middlewares.

Key methods:
- `getRequest()`, `getResponse()`, `getNext()`
- `getId()` request ID
- `getUser()`, `getUserOrFail()`, `getApiToken()`
- `getParams()`, `getParam(k)`, `getQueryParams()`, `getQueryParam(k)`, `getBody()`
- `getRouteItem()` current route metadata
- `resourceContext` helper for resource routes
- Request/IP context: `setContext(k,v)`, `getByRequest(k)`, `setIpContext(k,v,ttl?)`, `getIpContext(k)`
- File uploads: `getFile(key)`, `getFiles(key)`, `uploadFile(file)`
- Validation body: `getValidatorBody()`

Security helpers (when Auth is configured):
- `getUserRoles()` returns roles for current user
- `hasScopes(scopes, exactMatch?)`

Example in a controller action:
```ts
class UsersController extends Controller {
  async show() {
    const id = this.context.getParam('id');
    // ...
  }
}
```

## Request Context

(See alternative [AsyncLocalStorage](./async-local-storage.md))

The request context is a mechanism for storing and retrieving data that is scoped to the current HTTP request or to the client's IP address. This is useful for sharing data between middlewares, controllers, or other parts of the request lifecycle without polluting the request object directly.

The context is managed by the `RequestContext` service, which is a singleton and can be accessed via `HttpEnvironment.getInstance().requestContext`. You typically interact with it through the `HttpContext` methods:

### Per-request context

- **Set a value for the current request:**
  ```ts
  context.setContext('key', value);
  ```
- **Get a value for the current request:**
  ```ts
  const value = context.getByRequest('key');
  ```

Values set this way are only available for the lifetime of the current request and are isolated from other requests.

### Per-IP context

- **Set a value for the current IP address:**
  ```ts
  context.setIpContext('key', value, ttlSeconds?);
  ```
  - `ttlSeconds` (optional): If provided, the value will expire after the given number of seconds.

- **Get a value for the current IP address:**
  ```ts
  const value = context.getIpContext('key');
  ```

This is useful for storing temporary data associated with a client, such as rate limiting counters or verification codes.

### Example

Suppose you want to store a value during a request and access it later in the same request:
  
```ts
context.setContext('key', value);
```
```ts
const value = context.getByRequest('key');
```


