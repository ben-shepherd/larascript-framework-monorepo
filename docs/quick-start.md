# Quick Start Guide

Get up and running with Larascript in minutes! This guide will help you set up your development environment and create your first application.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **pnpm** (v10.0.0 or higher)
- **Docker** (for database services)
- **Git**

### Installing Prerequisites

#### Node.js
Download and install from [nodejs.org](https://nodejs.org/)

#### pnpm
```bash
npm install -g pnpm@10.0.0
```

#### Docker
Download and install from [docker.com](https://docker.com/)

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ben-shepherd/larascript-monorepo.git
cd larascript-monorepo
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Build All Packages
```bash
pnpm build
```

## 🗄️ Database Setup

### Start Database Services
```bash
# Start PostgreSQL and MongoDB
pnpm db:up

# Or start them individually
pnpm db:postgres:up
pnpm db:mongodb:up
```

### Verify Database Connection
The databases will be available at:
- **PostgreSQL**: `localhost:5432`
- **MongoDB**: `localhost:27017`

## 🏃‍♂️ Running the Framework

### Development Mode
```bash
# Start the framework in development mode
pnpm dev

# The application will be available at http://localhost:3000
```

### Production Mode
```bash
# Build and start in production mode
pnpm build
pnpm start
```

## 🧪 Testing

### Run All Tests
```bash
pnpm test
```

### Run Tests for Specific Package
```bash
cd libs/larascript-core
pnpm test
```

### Run Tests with Coverage
```bash
pnpm test:coverage
```

## 📝 Your First Application

### 1. Create a New Route

Navigate to `apps/larascript-framework/src/app/routes/` and create a new route file:

```typescript
// src/app/routes/hello.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from Larascript!' });
});

export default router;
```

### 2. Register the Route

Add your route to the main application in `src/app.ts`:

```typescript
import helloRoutes from './app/routes/hello';

// ... existing code ...

app.use('/api/hello', helloRoutes);
```

### 3. Test Your Route

```bash
# Start the development server
pnpm dev

# Test your endpoint
curl http://localhost:3000/api/hello
```

## 🛠️ Development Workflow

### Code Quality
```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm typecheck
```

### Building
```bash
# Build all packages
pnpm build

# Build specific package
cd libs/larascript-core
pnpm build
```

### Watching for Changes
```bash
# Watch mode for development
pnpm build:watch
```

## 📦 Working with Packages

### Using a Package in Your Project

```typescript
// Import from a Larascript package
import { Collection } from '@larascript-framework/larascript-collection';
import { Logger } from '@larascript-framework/larascript-logger';

// Use the package
const collection = new Collection([1, 2, 3]);
const logger = new Logger();
```

### Creating a New Package

1. **Use the Template**:
   ```bash
   cp -r libs/larascript-forkable-bundle libs/my-new-package
   cd libs/my-new-package
   ```

2. **Update Package Configuration**:
   ```json
   {
     "name": "@larascript-framework/my-new-package",
     "version": "1.0.0",
     "description": "Your package description"
   }
   ```

3. **Add to Workspace**:
   The package will automatically be available in the workspace.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the framework directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=larascript
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Database Configuration

The framework supports multiple database configurations:

```typescript
// PostgreSQL
const postgresConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// MongoDB
const mongoConfig = {
  url: process.env.MONGO_URL || 'mongodb://localhost:27017/larascript',
};
```

## 🐳 Docker Development

### Start API with Docker
```bash
# Start the API container
pnpm api:up

# Access the container shell
pnpm api:sh

# Stop the API
pnpm api:down
```

### Docker Compose Services
```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop all services
docker-compose -f docker/docker-compose.yml down
```

## 🔍 Debugging

### Development Debugging
```bash
# Start with debugging enabled
NODE_ENV=development DEBUG=* pnpm dev
```

### VS Code Debugging
Create a `.vscode/launch.json` file:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Larascript",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/apps/larascript-framework/src/app.ts",
      "runtimeArgs": ["-r", "ts-node/register", "-r", "tsconfig-paths/register"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## 📚 Next Steps

Now that you're up and running, explore these resources:

1. **[Development Setup](./development-setup.md)** - Complete development environment setup
2. **[Package Development](./package-development.md)** - How to work with individual packages
3. **[Framework Guide](./framework/framework-guide.md)** - Main framework documentation
4. **[API Reference](./framework/api-reference.md)** - Framework API documentation

## 🆘 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### Database Connection Issues
```bash
# Check if databases are running
docker ps

# Restart databases
pnpm db:restart
```

#### Build Issues
```bash
# Clean and rebuild
rm -rf node_modules
pnpm install
pnpm build
```

#### Permission Issues
```bash
# Fix file permissions
chmod +x scripts/*.sh
```

## 🎯 Quick Commands Reference

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all packages

# Database
pnpm db:up            # Start databases
pnpm db:down          # Stop databases
pnpm db:restart       # Restart databases

# Docker
pnpm api:up           # Start API container
pnpm api:down         # Stop API container
pnpm api:sh           # Access API container

# Package Management
pnpm install          # Install dependencies
pnpm update           # Update dependencies
pnpm clean            # Clean build artifacts
```

---

**Need Help?** Check out the [Troubleshooting Guide](./operations/troubleshooting.md) or [open an issue](https://github.com/ben-shepherd/larascript-monorepo/issues) on GitHub.
