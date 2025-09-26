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

Example in a controller action:
```ts
class UsersController extends Controller {
  async show() {
    const id = this.context.getParam('id');
    // ...
  }
}
```


