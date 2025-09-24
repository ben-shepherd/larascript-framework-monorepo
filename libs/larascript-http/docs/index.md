# Larascript HTTP Framework Documentation

A comprehensive HTTP framework built on Express.js with advanced routing, security, middleware, and context management capabilities.

## Key Features

### 🛣️ Flexible Routing
- **Express Functions**: Direct Express.js route handlers
- **Controller Classes**: Object-oriented route handling
- **Controller Methods**: Specific method routing
- **Resource Routes**: RESTful resource management

### 🔒 Advanced Security
- **Rate Limiting**: Configurable request rate limits
- **Role-Based Access**: User role validation
- **Scope Permissions**: Granular permission system
- **Resource Ownership**: Owner-based access control

### 🔄 Middleware System
- **Execution Order**: Predictable middleware chain
- **Global Middleware**: Application-wide processing
- **Route Middleware**: Route-specific processing
- **Async Session**: Request-scoped data management

### 📊 Context Management
- **Request Context**: Request-scoped data storage
- **Async Sessions**: Persistent session data
- **Request IDs**: Unique request tracking
- **User Context**: Authentication state management

## Quick Start

```typescript
import { HttpService, HttpRouter, Controller } from '@larascript-framework/http';

// Initialize HTTP service
const httpService = new HttpService({
  enabled: true,
  port: 3000
});

// Create router
const router = new HttpRouter();

// Define routes
router.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// Bind routes and start server
httpService.bindRoutes(router);
await httpService.listen();
```

## Routing Examples

### Express Functions
```typescript
router.get('/test', (req, res) => {
  res.json({ message: 'Hello World' });
});
```

### Controller Classes
```typescript
class UserController extends Controller {
  async invoke(context: HttpContext) {
    this.jsonResponse({ users: [] }, 200);
  }
}

router.get('/users', UserController);
```

### Controller Methods
```typescript
class UserController extends Controller {
  async index(context: HttpContext) {
    this.jsonResponse({ users: [] }, 200);
  }
}

router.get('/users', [UserController, 'index']);
```

## Security Features

### Rate Limiting
```typescript
router.get('/api/data', controller, {
  security: [
    router.security().rateLimited(100, 60) // 100 requests per minute
  ]
});
```

### Role-Based Access
```typescript
router.post('/admin/users', controller, {
  security: [
    router.security().hasRole('admin')
  ]
});
```

### Scope Permissions
```typescript
router.get('/posts', controller, {
  security: [
    router.security().scopes('posts.read', true)
  ]
});
```

## Middleware System

### Custom Middleware
```typescript
class AuthMiddleware extends Middleware {
  async execute(context: HttpContext) {
    // Authentication logic
    this.next();
  }
}

router.get('/protected', controller, {
  middlewares: [AuthMiddleware]
});
```

### Middleware Execution Order
1. **Before All Middlewares**: Global pre-processing
2. **Route Middlewares**: Route-specific processing
3. **After All Middlewares**: Global post-processing

## Context Management

### Request Context
```typescript
class DataMiddleware extends Middleware {
  async execute(context: HttpContext) {
    context.setContext('userData', { id: 1, name: 'John' });
    this.next();
  }
}

class UserController extends Controller {
  async invoke(context: HttpContext) {
    const userData = context.getByRequest('userData');
    this.jsonResponse({ user: userData }, 200);
  }
}
```

### Async Sessions
```typescript
class SessionMiddleware extends Middleware {
  async execute(context: HttpContext) {
    const session = Http.getInstance().getAsyncSession().getSession();
    session.data = { userId: 123 };
    this.next();
  }
}
```

## Error Handling

The framework provides comprehensive error handling with:
- **Security Exceptions**: Access denied responses
- **Rate Limit Errors**: 429 status codes
- **Validation Errors**: Input validation failures
- **Route Exceptions**: Route-specific errors

## Testing

The framework includes comprehensive test suites covering:
- **Security Tests**: Rate limiting, role validation, scope checking
- **Routing Tests**: All routing methods and configurations
- **Middleware Tests**: Execution order and context passing
- **Integration Tests**: End-to-end request handling

## Best Practices

1. **Use Controllers** for complex business logic
2. **Apply Security Rules** to protect sensitive endpoints
3. **Leverage Middleware** for cross-cutting concerns
4. **Use Request Context** for request-scoped data
5. **Implement Proper Error Handling** for all routes

## API Reference

### Core Services
- `HttpService`: Main HTTP service for server management
- `Http`: Singleton HTTP instance for global access

### Base Classes
- `Controller`: Base class for route controllers
- `Middleware`: Base class for custom middleware

### Context Management
- `HttpContext`: Request/response context wrapper
- `RequestContext`: Request-scoped data management

### Routing
- `HttpRouter`: Route definition and management
- `Route`: Individual route configuration

### Security
- `SecurityMiddleware`: Security rule enforcement
- `SecurityReader`: Security rule resolution

### Enums and Types
- `SecurityEnum`: Security rule types
- `ALWAYS`: Security scope constant

For detailed API documentation, see the individual module exports. Each module includes comprehensive JSDoc comments and TypeScript definitions.
