# Future Plans

## Database Abstraction Layer

### RouteResourceRepository

We need to create an adapter/abstraction layer to decouple the HTTP service from direct database dependencies. Instead of passing the `DatabaseService` to `Http.ts` as a dependency, we should implement a `RouteResourceRepository` or similar abstract layer.

#### Goals:
- **Decouple HTTP service from Larascript database service**: Remove direct dependency on `IDatabaseService` and `IEloquentQueryBuilderService` from the HTTP service
- **Enable flexible data sources**: Allow the HTTP service to work with different data sources beyond Larascript's database service
- **Improve testability**: Make it easier to mock data access for testing
- **Better separation of concerns**: Keep HTTP routing logic separate from database implementation details

#### Implementation Approach:
1. Create an abstract `RouteResourceRepository` interface
2. Implement concrete repositories for different data sources (Larascript database, external APIs, etc.)
3. Update `Http.ts` to use the repository pattern instead of direct database service injection
4. Maintain backward compatibility during the transition

#### Benefits:
- More flexible architecture
- Easier to integrate with external data sources
- Better testability
- Cleaner separation of concerns
- Future-proof design for different data access patterns
