## Test Coverage Checklist

### Auth & Resource Owner Security
- [x] Create: Unauthenticated request with `resourceOwner` enabled should return 401.
- [x] Show: Unauthenticated request with `resourceOwner` enabled should return 403.
- [x] Index: When `resourceOwner` is enabled but user is not authenticated, owner filter should **not** be applied (results unfiltered) — clarify and assert intended behavior.

### Resource Owner Configuration
- [x] Misconfigured `resourceOwner` attribute type (non-string) should throw a `ResourceException`.

### Not-Found and ID Validation
- [x] Show: Invalid id (e.g., `"null"`) returns 404 with `{ message: 'Resource not found' }`.
- [x] Show/Update/Delete: Non-existent resource returns 404.

### Response Metadata
- [x] Index responses include `totalCount`.
- [x] Index responses include pagination metadata (`page`, and default `pageSize` from route options when set).

### Filtering Behavior
- [ ] Fields not listed in `searching.fields` are stripped from filters.
- [ ] Fuzzy mode: Boolean values are not wrapped with `%` (`true`/`false` handled as strings), other values are wrapped with `%value%`.
- [ ] Base route `resource.filters.index` are merged with request filters and still respect allowed fields.

### Sorting Behavior
- [x] Direction normalization: `-`, `'desc'`, `-1` => `desc`; `'asc'`, `1`, other => `asc`.
- [x] Multiple field sorts are applied in order and passed to the repository.
- [x] Defaults when no sort query present: falls back to configured defaults; if none provided, uses `createdAt asc`.

### Sensitive Data Stripping
- [x] Create/Show/Update/Index responses do **not** include guarded/sensitive attributes.

### Router Options
- [x] `only`: When specifying a subset (e.g., `['index','show']`), other endpoints are not registered and return 404.
- [x] Repository datasource (vs model datasource) works end-to-end across all CRUD operations.

### Pagination Behavior
- [ ] `allowPageSizeOverride: false` prevents `pageSize` query from overriding route default.
- [ ] Large page numbers beyond available results return empty arrays with correct pagination metadata.