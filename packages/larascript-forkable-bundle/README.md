# Larascript Bundle Template

This is a template repository for creating Larascript bundles. Follow the steps below to create your own bundle.

## Creating a New Bundle

### 1. Fork or Clone the Repository

**Option A: Fork the repository**
- Go to the original repository on GitHub
- Click the "Fork" button to create your own copy

**Option B: Clone the repository**
```bash
git clone https://github.com/ben-shepherd/larascript-forkable-bundle-original.git
```

### 2. Rename the Directory

Change the cloned directory name to match your bundle name:

```bash
# If you cloned the repo
mv larascript-forkable-bundle-original larascript-your-bundle-name

# Example:
mv larascript-forkable-bundle-original larascript-components-bundle
```

### 3. Update package.json

Edit the `package.json` file and update the following fields:

```json
{
  "name": "@your-username/larascript-your-bundle-name",
  "description": "Your bundle description here",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-username/larascript-your-bundle-name"
  }
}
```

**Required changes:**
- `name`: Change from "PLACEHOLDER" to your bundle name (e.g., "larascript-components-bundle")
- `description`: Replace "PLACEHOLDER DESCRIPTION" with a meaningful description
- `repository.url`: Update to point to your new repository URL

### 4. Set Git Remote Origin URL

Update your git remote to point to your new repository:

```bash
git remote set-url origin https://github.com/your-username/larascript-your-bundle-name.git
```

### 5. Update Repository Settings

If you forked the repository:
1. Go to your forked repository on GitHub
2. Update the repository name to match your bundle name
3. Update the repository description

### 6. Initialize Your Bundle

```bash
# Install dependencies
npm install

# Run tests to ensure everything works
npm test

# Build the project
npm run build
```

### 7. Customize Your Bundle

- Add your bundle-specific code to `src/index.ts`
- Update tests in the `src/tests/` directory
- Modify configuration files as needed (`tsconfig.json`, `jest.config.js`, etc.)

## Important Notes

### Export Guidelines

**No Default Exports**: All exports should be named exports. Avoid using `export default`.

**Index Files**: Create an `index.ts` file in every directory you create and export all files from that directory.

**Example Structure:**
```
src/
├── index.ts                 # Main entry point
├── components/
│   ├── index.ts            # Export all components
│   ├── Button.ts
│   └── Modal.ts
├── utils/
│   ├── index.ts            # Export all utilities
│   ├── helpers.ts
│   └── validators.ts
└── types/
    ├── index.ts            # Export all types
    └── common.ts
```

**Example index.ts files:**

```typescript
// src/components/index.ts
export * from './Button';
export * from './Modal';

// src/utils/index.ts
export * from './helpers';
export * from './validators';

// src/types/index.ts
export * from './common';

// src/index.ts (main entry)
export * from './components';
export * from './utils';
export * from './types';
```

### 8. Update This README

Replace this content with documentation specific to your bundle:
- What the bundle does
- How to install and use it
- Examples and API documentation
- Contributing guidelines

## Development Workflow

This template includes several helpful scripts:

- `npm run build` - Build the TypeScript code
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues
- `npm run format` - Format code with Prettier

### Setting up Lefthook

This project uses Lefthook for pre-commit hooks. To set it up:

```bash
# Install lefthook locally (recommended)
npx lefthook install

# If the above doesn't work, install lefthook globally and try again
npm install -g lefthook
lefthook install
```

Lefthook will automatically run linting, formatting, and tests before each commit to ensure code quality.

### Upstream Repository Management

If you've forked this repository and want to keep your fork in sync with the original repository, use these commands:

- `npm run upstream:setup` - Sets up the upstream remote pointing to the original repository
- `npm run upstream:fetch` - Fetches the latest changes from the upstream repository
- `npm run upstream:merge` - Fetches and merges the latest changes from upstream into your current branch
- `npm run upstream:rebase` - Fetches and rebases your current branch on top of the latest upstream changes

**Note**: The `upstream:setup` command configures the upstream remote to prevent accidental pushes to the original repository. You cannot push to the upstream repository - it's configured as read-only.

## Publishing

When ready to publish:

1. Update the version in `package.json`
2. Commit your changes
3. Create a git tag for the version
4. Push to GitHub
5. The package will be published to the GitHub Package Registry

## Template Features

- TypeScript configuration
- Jest testing setup
- ESLint and Prettier for code quality
- Commit message linting with conventional commits
- GitHub Actions ready
- Branch name validation
- Pre-commit hooks with Lefthook

## Support

For questions about this template or Larascript bundles in general, please refer to the main Larascript documentation or create an issue in the original repository.