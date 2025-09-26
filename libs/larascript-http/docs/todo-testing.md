## Test Coverage Checklist

### Auth & Resource Owner Security
- [x] Create: Unauthenticated request with `resourceOwner` enabled should return 401.
- [x] Show: Unauthenticated request with `resourceOwner` enabled should return 403.
- [ ] Index: When `resourceOwner` is enabled but user is not authenticated, owner filter should **not** be applied (results unfiltered) — clarify and assert intended behavior.

### Resource Owner Configuration
- [ ] Misconfigured `resourceOwner` attribute type (non-string) should throw a `ResourceException`.
- [ ] `resourceOwner` attribute missing on resource should throw a `ResourceException`.

### Not-Found and ID Validation
- [ ] Show: Invalid id (e.g., `"null"`) returns 404 with `{ message: 'Resource not found' }`.
- [ ] Show/Update/Delete: Non-existent resource returns 404.

### Response Metadata
- [ ] Index responses include `totalCount`.
- [ ] Index responses include pagination metadata (`page`, and default `pageSize` from route options when set).

### Filtering Behavior
- [ ] Fields not listed in `searching.fields` are stripped from filters.
- [ ] Fuzzy mode: Boolean values are not wrapped with `%` (`true`/`false` handled as strings), other values are wrapped with `%value%`.
- [ ] Base route `resource.filters.index` are merged with request filters and still respect allowed fields.

### Sorting Behavior
- [ ] Direction normalization: `-`, `'desc'`, `-1` => `desc`; `'asc'`, `1`, other => `asc`.
- [ ] Multiple field sorts are applied in order and passed to the repository.
- [ ] Defaults when no sort query present: falls back to configured defaults; if none provided, uses `createdAt asc`.

### Sensitive Data Stripping
- [ ] Create/Show/Update/Index responses do **not** include guarded/sensitive attributes.

### Router Options
- [ ] `only`: When specifying a subset (e.g., `['index','show']`), other endpoints are not registered and return 404.
- [ ] Repository datasource (vs model datasource) works end-to-end across all CRUD operations.

### Pagination Behavior
- [ ] `allowPageSizeOverride: false` prevents `pageSize` query from overriding route default.
- [ ] Large page numbers beyond available results return empty arrays with correct pagination metadata.