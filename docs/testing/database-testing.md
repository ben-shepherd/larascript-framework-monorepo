## Testing asynchronous code (databases)

When tests use asynchronous resources like databases, sockets, or HTTP servers, parallel test workers can contend for shared singletons and connections. This can cause intermittent failures (e.g., a PostgreSQL pool being ended or briefly undefined between insert and refresh flows).

### Run tests in-band

Prefer running Jest in a single worker when exercising DB-backed code:

```bash
pnpm test -- --runInBand
# or
jest --runInBand
```

Alternatives:
- Set a global limit: `jest --maxWorkers=1`.
- Configure in `jest.config` with `maxWorkers: 1` for DB suites only.

### Best practices to avoid race conditions

- Boot shared test environments once per file using `beforeAll`/`afterAll` instead of `beforeEach`.
- If you start an HTTP server, explicitly close it after tests (e.g., call `httpService.close()` in `afterAll`).
- Avoid re-initializing database/HTTP singletons while requests may still be in flight.
- If you must run tests in parallel, isolate stateful resources (unique connection names, separate databases) to prevent cross-test interference.

### Symptoms you might see

- Pool/client becomes undefined or ended after an operation, then a subsequent query/refresh fails.
- Errors like “Cannot read properties of undefined (reading 'query'|'connect')” that disappear when re-running.

### Quick fix

- Re-run with `--runInBand` to serialize DB tests and eliminate cross-worker contention.


