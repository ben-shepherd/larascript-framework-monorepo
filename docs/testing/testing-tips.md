# Table of Contents

- [Testing Single Test](#testing-single-test)
- [Async Tests](#async-tests)
- [Test Database Environment](#test-database-environment)
    - [Enable docker start up when testing](#enable-docker-start-up-when-testing)

## Recommended Scripts

Here are some recommended scripts for testing:

```json
"scripts": {
    "test": "jest --runInBand --passWithNoTests",
    "test:watch": "jest --watch --passWithNoTests",
    "test:coverage": "jest --coverage --passWithNoTests",
}
```

## Async Tests

It is recommended to run your tests with `--runInBand` to ensure that the tests are run in a single thread and avoid race conditions.

## Testing Single Test

If you are testing a single test file, you can run the following command:

```bash
pnpm npm run test -- filename -t "should do something"
```

## Test Database Environment

If you want to use a test database environment

Add the following to your `package.json` file:

```json
"scripts": {
    "test": "npm run db:postgres:restart && jest --runInBand --passWithNoTests && npm run db:postgres:down",
    "db:postgres:down": "cd ./docker && docker-compose -f ../../test-database/docker/docker-compose.postgres.yml down -v",
    "db:postgres:up": "cd ./docker && docker-compose -f ../../test-database/docker/docker-compose.postgres.yml up -d"
}
```

(Make sure you replace relative paths to point to `/libs/test-database/docker/docker-compose.postgres.yml`)

At the start of your tests, you can use the test database environment:

```typescript
await TestDatabaseEnvironment.create().boot();  
```

You will now be able to run queries against the database. e.g: 

```typescript
const user = await UserModel.query().where('email', 'test@test.com').first();
```

### Enable docker start up when testing

Adjust your `test` script to start up the database before running the tests:

```json
"scripts": {
    "test": "npm run db:postgres:restart && jest --runInBand --passWithNoTests && npm run db:postgres:down",
}
```

If docker is already running, then run `npm run test:nodb` to speed up the test startup time.
