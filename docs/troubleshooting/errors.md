

## Importing module that doesn't exist

This is typically caused by a module that has been built but tsc-alias has not been run.

If required, add the `build:watch` script to the package.json and run it.

```json
"scripts": {
    "build": "tsc --skipLibCheck && npx tsc-alias",
    "build:watch": "concurrently --kill-others \"tsc -w\" \"tsc-alias -w\"",
}
```

### Error Example

```
                                                                                                       
    Configuration error:

    Could not locate module @/database/index.js mapped as:
    C:\Users\bensh\Documents\Projects\larascript\larascript-monorepo\libs\http\src\$1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^@\/(.*)\.js$/": "C:\Users\bensh\Documents\Projects\larascript\larascript-monorepo\libs\http\src\$1"
      },
      "resolver": undefined
    }

    > 1 | import { DB } from "@/database/index.js";
        | ^
      3 |  * BaseMigration class serves as the foundation for all database migrations.
      4 |  * It implements the IMigration interface and provides core functionality

      at createNoMappedModuleFoundError (../../node_modules/.pnpm/jest-resolve@30.1.3/node_modules/jest-resolve/build/index.js:1117:17)
      at Object.<anonymous> (../larascript-database/dist/migrations/base/BaseMigration.js:1:1)
      at Object.<anonymous> (../larascript-database/dist/migrations/base/index.js:1:1)
      at Object.<anonymous> (../larascript-database/dist/migrations/index.js:1:1)
      at Object.<anonymous> (../larascript-database/dist/index.js:3:1)
      at Object.<anonymous> (src/tests/DatabaseResourceRepository.test.ts:5:1)

```