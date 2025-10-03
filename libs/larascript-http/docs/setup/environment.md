## Http Environment

`HttpEnvironment` is the orchestration layer that boots and wires up the HTTP services for Larascript. Its primary job is to initialize the HTTP server, set up request context, logging, and file uploads, and bridge to framework services like Auth and Database when available.

## Table of contents

- [Summary](#summary)
- [Boot lifecycle](#boot-lifecycle)
- [Configuration](#configuration)
- [Using with or without Auth/Database](#using-with-or-without-authdatabase)
- [Quick start](#quick-start)
- [Disable Auth/Database (custom security)](#disable-authdatabase-custom-security)

### Summary

Creates the HTTP server, sets up request context, logging, and file uploads, and bridges to framework services like Auth and Database when available.

### Configuration
Defaults used when not provided:
- `authConfigured: true`
- `databaseConfigured: true`
- `uploadDirectory: <project>/storage/uploads`
- `environment: EnvironmentTesting`

You can set or refine configuration at creation time or later with `setPartialConfig(config)`.

Optional dependencies (provide via `config.dependencies`):
- `loggerService?: ILoggerService` — if omitted, a default `LoggerService` is created with logs under `<project>/storage/logs`.

### Using with or without Auth/Database
When used inside the Larascript Framework, `HttpEnvironment` integrates with the framework’s Auth and Database services. These are optional via feature flags:

- `authConfigured: boolean`
- `databaseConfigured: boolean`

Disabling either will limit certain built-in features:
- Security and authorization middleware rely on Auth (and often Database) to evaluate roles, scopes, ownership, and tokens.
- With these disabled, you must supply your own authentication/authorization strategies and middleware for protected endpoints.

The rest of the HTTP stack (routing, request context, validation, uploads, etc.) can still function, but security-related helpers will not be available out of the box.

### Quick start
```ts
import { HttpEnvironment, HttpService, baseConfig } from '@larascript-framework/larascript-http';

const httpService = new HttpService({
    port: 3000,
  ...baseConfig,
});

const env = HttpEnvironment.create(httpService, {
  // optional overrides
  uploadDirectory: process.cwd() + '/storage/uploads',
});

await env.boot();
```

### Disable Auth/Database (custom security)
```ts
const env = HttpEnvironment.create(httpService, {
  authConfigured: false,
  databaseConfigured: false,
});

// Provide your own auth middleware for protected routes
await env.boot();
```

### Custom logger and uploads directory
```ts
import path from 'path';
import { LoggerService } from '@larascript-framework/larascript-logger';

const env = HttpEnvironment.create(httpService, {
  uploadDirectory: path.join(process.cwd(), 'var/uploads'),
  dependencies: {
    loggerService: new LoggerService({ logPath: path.join(process.cwd(), 'var/logs') })
  }
});

await env.boot();
```

### API overview
- `static create(httpService, config?)` — merges defaults, sets the HTTP service, returns the singleton instance.
- `boot()` — initializes request context, logger, uploads, then starts the HTTP server.
- `close()` — stops the HTTP server if running.
- `setPartialConfig(config)` — update configuration at runtime.
- `isAuthConfigured()` / `isDatabaseConfigured()` — feature flag checks.

Convenience getters:
- `authEnvironment`, `authService`
- `databaseEnvironment`, `databaseService`, `queryBuilderService`
- `asyncSession`
- `httpService`, `requestContext`, `uploadService`, `loggerService`

Note: `HttpEnvironment` is a singleton. Repeated calls to `create` return the same instance (updated with provided configuration).


