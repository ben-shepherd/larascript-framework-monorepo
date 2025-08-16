# Architecture Guide

## 🏗️ Monorepo Architecture

The Larascript monorepo is designed with a clear separation of concerns, modularity, and scalability in mind. This guide explains the architectural decisions and patterns used throughout the project.

## 📁 Directory Structure

```
larascript-monorepo/
├── apps/                          # Application packages
│   └── larascript-framework/     # Main framework application
├── libs/                          # Shared library packages
│   ├── larascript-core/          # Core framework components
│   ├── larascript-acl/           # Access control system
│   ├── larascript-validator/     # Validation system
│   ├── larascript-logger/        # Logging system
│   ├── larascript-observer/      # Event observer pattern
│   ├── larascript-views/         # View rendering system
│   ├── larascript-collection/    # Collection utilities
│   ├── larascript-utils/         # Common utilities
│   ├── async-session/            # Session management
│   ├── cast-js/                  # Type casting utilities
│   ├── crypto-js/                # Cryptographic utilities
│   ├── dot-notation-extractor/   # Data extraction utilities
│   ├── larascript-mail/          # Email functionality
│   ├── eslint-config/            # Shared ESLint configuration
│   ├── tsconfig/                 # Shared TypeScript configuration
│   ├── jest-config/              # Shared Jest configuration
│   └── check-exports/            # Export validation utilities
├── docs/                         # Documentation
├── package.json                  # Root package configuration
├── pnpm-workspace.yaml          # Workspace configuration
└── turbo.json                   # Build orchestration
```

## 🎯 Design Principles

### 1. Modularity
Each package is self-contained with clear boundaries and responsibilities. Packages can be used independently or composed together.

### 2. Type Safety
Full TypeScript support with strict typing ensures compile-time error detection and better developer experience.

### 3. Dependency Management
- **Workspace Dependencies**: Internal packages use `workspace:*` for version consistency
- **External Dependencies**: Latest stable versions for external packages
- **Peer Dependencies**: Minimal peer dependencies to avoid conflicts

### 4. Consistent Structure
All packages follow the same structure:
```
package-name/
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   └── [feature]/         # Feature-specific modules
├── tests/                 # Test files
├── docs/                  # Package-specific documentation
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
└── jest.config.js         # Jest configuration
```

## 📦 Package Architecture

### Core Framework Packages

#### `@repo/larascript-core`
The foundation of the Larascript ecosystem.

**Key Components:**
- **Base Classes**: Abstract base classes for common patterns
- **Interfaces**: Core interfaces and type definitions
- **Exceptions**: Custom exception classes
- **Services**: Core service implementations
- **Utilities**: Framework-specific utilities

**Dependencies:**
- `@repo/larascript-utils` (workspace dependency)

#### `@repo/larascript-acl`
Access Control List system for authorization.

**Key Components:**
- **ACL Service**: Main ACL implementation
- **Scope Management**: Permission scope handling
- **Composable ACL**: Flexible permission composition
- **Exception Handling**: ACL-specific exceptions

**Dependencies:**
- `@repo/larascript-core` (workspace dependency)

#### `@repo/larascript-validator`
Comprehensive validation system.

**Key Components:**
- **Validation Rules**: Built-in validation rules
- **Custom Validators**: Extensible validation system
- **Error Handling**: Validation error management
- **Type Validation**: TypeScript integration

**Dependencies:**
- `@repo/larascript-core` (workspace dependency)

### Utility Packages

#### `@repo/async-session`
Asynchronous session management.

**Key Components:**
- **Session Service**: Main session implementation
- **Storage Adapters**: Multiple storage backends
- **Session Middleware**: Express.js integration

#### `@repo/cast-js`
Type casting and transformation utilities.

**Key Components:**
- **Castable Interface**: Base interface for castable types
- **Built-in Casts**: Common type casting operations
- **Custom Casts**: Extensible casting system

#### `@repo/crypto-js`
Cryptographic operations and security utilities.

**Key Components:**
- **Crypto Service**: Main cryptographic operations
- **Encryption/Decryption**: Symmetric and asymmetric encryption
- **Hashing**: Secure hashing algorithms
- **Key Management**: Cryptographic key handling

### Development Tools

#### `@repo/eslint-config`
Standardized ESLint configuration.

**Features:**
- **TypeScript Support**: Full TypeScript linting rules
- **Import Sorting**: Automatic import organization
- **Code Quality**: Best practices enforcement
- **Extensible**: Easy to extend for specific needs

#### `@repo/tsconfig`
Shared TypeScript configuration.

**Features:**
- **Strict Mode**: Strict TypeScript configuration
- **Path Mapping**: Consistent import paths
- **Module Resolution**: Modern module resolution
- **Extensible**: Base configuration for packages

## 🔄 Build System Architecture

### Turbo Pipeline
The build system uses Turbo for efficient monorepo management:

```json
{
  "tasks": {
    "lint": { "dependsOn": ["^lint"] },
    "test": { "outputs": ["dist/**"] },
    "build": { 
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "check": { "dependsOn": ["^check"] }
  }
}
```

### Build Dependencies
- **Dependency Order**: Packages build in dependency order
- **Caching**: Turbo caches build outputs for faster rebuilds
- **Parallel Execution**: Independent tasks run in parallel
- **Incremental Builds**: Only changed packages are rebuilt

## 🏗️ Framework Architecture

### Application Structure
```
larascript-framework/
├── src/
│   ├── app/                 # Application logic
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Data models
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # Route definitions
│   │   └── validators/      # Request validation
│   ├── config/              # Configuration files
│   ├── core/                # Core framework components
│   └── setup.ts             # Application setup
├── docker/                  # Docker configuration
└── tests/                   # Test files
```

### Core Components

#### Application Kernel
The main application entry point that orchestrates all components.

**Responsibilities:**
- **Service Registration**: Register and configure services
- **Middleware Setup**: Configure Express middleware
- **Route Registration**: Register application routes
- **Error Handling**: Global error handling setup

#### Service Container
Dependency injection container for managing service instances.

**Features:**
- **Service Registration**: Register services with dependencies
- **Lazy Loading**: Services are instantiated on demand
- **Singleton Management**: Ensure single instances
- **Lifecycle Management**: Service lifecycle hooks

#### Database Layer
Abstract database interface with multiple backend support.

**Supported Databases:**
- **PostgreSQL**: Primary relational database
- **MongoDB**: NoSQL database support
- **Sequelize ORM**: Database abstraction layer

## 🔐 Security Architecture

### Authentication
- **JWT Tokens**: Stateless authentication
- **Session Management**: Optional session-based auth
- **Password Hashing**: Secure password storage with bcrypt

### Authorization
- **ACL System**: Flexible permission management
- **Role-Based Access**: Role-based authorization
- **Resource-Level Permissions**: Granular permission control

### Security Features
- **CSRF Protection**: Cross-site request forgery protection
- **Rate Limiting**: API rate limiting
- **Input Validation**: Comprehensive input validation
- **Security Headers**: Security-focused HTTP headers

## 📊 Data Flow Architecture

### Request Flow
```
Client Request → Middleware → Route → Controller → Service → Model → Database
                ↓
            Response ← Controller ← Service ← Model ← Database
```

### Event Flow
```
Service Action → Event Emitter → Observer → Handler → Side Effect
```

### Validation Flow
```
Request Data → Validator → Validation Rules → Error Collection → Response
```

## 🧪 Testing Architecture

### Test Structure
```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test data and fixtures
```

### Testing Strategy
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Mocking**: Comprehensive mocking strategy

## 🚀 Deployment Architecture

### Container Strategy
- **Multi-Stage Builds**: Optimized Docker images
- **Environment Configuration**: Environment-specific configs
- **Health Checks**: Application health monitoring
- **Resource Limits**: Container resource management

### Environment Management
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

## 🔄 Migration Strategy

### Database Migrations
- **Version Control**: Migration files in version control
- **Rollback Support**: Ability to rollback migrations
- **Data Seeding**: Test data seeding capabilities

### Application Updates
- **Zero-Downtime**: Blue-green deployment strategy
- **Feature Flags**: Gradual feature rollout
- **Monitoring**: Comprehensive deployment monitoring

---

**Next Steps**: [Quick Start Guide](./quick-start.md) → [Development Setup](./development-setup.md) → [Package Development](./package-development.md)
