## Feature Checklist

- [x] Create an abstract AuthService layer that can be used to implement different auth strategies. (Rather than relying on Larascript Auth)
- [x] Create an abstract LoggerService layer that can be used to implement different logger strategies. (Rather than relying on Larascript Logger)
- [ ] Create an abstract StorageService layer that can be used to implement different storage strategies. (Rather than relying on Larascript Storage)
- [x] Refactor Http to be the entry point for the HTTP module. (Must provide config, and additional dependencies. Although some dependencies are optional)
- [ ] Database and EloquentQueryBuilder services should be optional dependencies.
- [ ] Update Test Coverage Checklist.
- [ ] Either disable extendExpress config, or provide a callback with the parent as a parameter that the user should call. This causes a bug where express-busboy is not extended.
- [ ] Implement Authorization Middleware.
- [ ] Implement Validation Middleware.

## Test Coverage Checklist