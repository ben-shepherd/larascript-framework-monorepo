# Larascript Monorepo

A comprehensive monorepo containing the Larascript Framework and its ecosystem of packages, providing a powerful Node.js framework with built-in ORM, type safety, and developer-friendly APIs.

## 🚀 Overview

Larascript is a modern, type-safe Node.js framework designed for building scalable applications with a focus on developer experience. This monorepo contains the main framework application and a collection of modular packages that can be used independently or together.

## �� Packages

### Core Framework
- **`app/larascript-framework`** - The main Larascript Framework application with full-stack capabilities

### Core Packages
- **`@ben-shepherd/larascript-core`** - Core components and foundational patterns
- **`@ben-shepherd/larascript-acl`** - Access Control List (ACL) system
- **`@ben-shepherd/larascript-collection`** - Collection utilities and data structures
- **`@ben-shepherd/larascript-logger`** - Logging system
- **`@ben-shepherd/larascript-observer`** - Event observer pattern implementation
- **`@ben-shepherd/larascript-validator`** - Validation system
- **`@ben-shepherd/larascript-views`** - View rendering system
- **`@ben-shepherd/larascript-utils`** - Utility functions and helpers

### Specialized Packages
- **`@ben-shepherd/async-session`** - Asynchronous session management
- **`@ben-shepherd/cast-js`** - Type casting utilities
- **`@ben-shepherd/crypto-js`** - Cryptographic utilities
- **`@ben-shepherd/dot-notation-extractor`** - Dot notation data extraction
- **`@ben-shepherd/larascript-mail`** - Email functionality

### Development Tools
- **`packages/eslint-config`** - Shared ESLint configuration
- **`packages/tsconfig`** - Shared TypeScript configuration

## Templates
- **`@ben-shepherd/larascript-forkable-bundle`** - A template package that can be copied as a starting point when creating new Larascript packages. Use this as a boilerplate for consistent structure, configuration, and best practices.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Build Tool**: Turbo (monorepo orchestration)
- **Testing**: Jest
- **Linting**: ESLint
- **Database**: PostgreSQL, MongoDB
- **ORM**: Sequelize
- **Web Framework**: Express.js
- **Template Engine**: EJS
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer, Resend
- **Cloud**: AWS SDK

## 📋 Prerequisites

- Node.js (v16 or higher)
- pnpm (v10.0.0 or higher)
- Docker (for database services)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd larascript-monorepo

# Install dependencies
pnpm install
```

### Development

```bash
# Start development environment
pnpm dev

# Run tests across all packages
pnpm test

# Build all packages
pnpm build

# Lint all packages
pnpm lint
```

### Database Setup

```bash
# Start PostgreSQL and MongoDB
pnpm db:up

# Stop databases
pnpm db:down

# Restart databases
pnpm db:restart
```

### API Development

```bash
# Start API with Docker
pnpm api:up

# Stop API
pnpm api:down

# Access API container shell
pnpm api:sh
```

## 📁 Project Structure

```
larascript-monorepo/
├── app/
│   └── larascript-framework/     # Main framework application
├── packages/                     # Individual packages
│   ├── larascript-core/         # Core framework components
│   ├── larascript-acl/          # Access control system
│   ├── larascript-collection/   # Collection utilities
│   └── ...                      # Other packages
├── docs/                        # Documentation
├── package.json                 # Root package configuration
├── pnpm-workspace.yaml         # Workspace configuration
└── turbo.json                  # Build orchestration
```

## 🧪 Testing

Each package includes comprehensive test suites:

```bash
# Run tests for all packages
pnpm test

# Run tests for specific package
cd packages/larascript-core
pnpm test

# Run tests with coverage
pnpm test:coverage
```

##  Development Scripts

### Root Level Commands
- `pnpm dev` - Start development environment
- `pnpm build` - Build all packages
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all packages
- `pnpm check` - Type checking across all packages

### Framework Application Commands
- `pnpm start` - Start the framework application
- `pnpm dev` - Start development server with hot reload
- `pnpm setup` - Run setup scripts
- `pnpm db:up` - Start database services
- `pnpm api:up` - Start API with Docker

## 📚 Documentation

- **Framework Documentation**: See `app/larascript-framework/` for main framework docs
- **Package Documentation**: Each package contains its own README and documentation
- **API Documentation**: Available when running the framework application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Follow the existing code style and patterns
4. Add comprehensive tests for new features
5. Update documentation as needed
6. Ensure all tests pass before submitting
7. Follow conventional commit message format

### Branch Naming Convention
Branches must follow the pattern: `^(feat|fix|hotfix|release|test|experimental|refactor)/.+$`

Example: `feat/example`

## 📄 License

ISC License - see individual package.json files for details.

## 👨‍💻 Author

**Ben Shepherd** - ben.shepherd@gmx.com

- LinkedIn: [Benjamin Shepherd](https://www.linkedin.com/in/benjamin-programmer/)

## 🔗 Links

- **Framework**: [Larascript Framework](./app/larascript-framework/)
- **Core Package**: [@ben-shepherd/larascript-core](./packages/larascript-core/)
- **Documentation**: [Docs](./docs/)

---

**Note**: This is a monorepo managed with pnpm workspaces and Turbo. Each package can be used independently or as part of the larger Larascript ecosystem.
