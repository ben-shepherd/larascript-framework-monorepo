# Code Style Guide

This guide outlines the coding standards and conventions used throughout the Larascript monorepo. Following these guidelines ensures consistency, readability, and maintainability across the codebase.

## 🎯 General Principles

### Code Quality
- **Readability**: Code should be self-documenting and easy to understand
- **Consistency**: Follow established patterns and conventions
- **Maintainability**: Write code that's easy to modify and extend
- **Performance**: Consider performance implications without premature optimization

### Best Practices
- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **SOLID Principles**: Follow object-oriented design principles
- **Single Responsibility**: Each function/class should have one clear purpose
- **Fail Fast**: Validate inputs early and throw errors for invalid states

## 📝 TypeScript Guidelines

### Type Definitions

#### Interfaces vs Types
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Use types for unions, intersections, and complex types
type UserRole = 'admin' | 'user' | 'guest';
type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

// Use types for function signatures
type UserValidator = (user: User) => boolean;
type AsyncHandler<T> = (data: T) => Promise<void>;
```

#### Generic Types
```typescript
// Use generics for reusable components
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Use constraints when needed
interface Identifiable {
  id: string;
}

class BaseRepository<T extends Identifiable> implements Repository<T> {
  // Implementation
}
```

### Class Definitions

#### Class Structure
```typescript
export class UserService {
  // 1. Static properties
  private static readonly DEFAULT_LIMIT = 10;

  // 2. Instance properties
  private readonly userRepository: IUserRepository;
  private readonly logger: Logger;

  // 3. Constructor
  constructor(
    userRepository: IUserRepository,
    logger: Logger
  ) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  // 4. Public methods
  async findById(id: string): Promise<User | null> {
    // Implementation
  }

  // 5. Private methods
  private async validateUser(user: User): Promise<void> {
    // Implementation
  }
}
```

#### Access Modifiers
```typescript
export class UserController {
  // Public: accessible from anywhere
  public async index(req: Request, res: Response): Promise<void> {
    // Implementation
  }

  // Protected: accessible within class and subclasses
  protected async validateRequest(req: Request): Promise<void> {
    // Implementation
  }

  // Private: accessible only within class
  private async logRequest(req: Request): Promise<void> {
    // Implementation
  }

  // Readonly: cannot be modified after initialization
  private readonly logger: Logger;
}
```

### Function Definitions

#### Function Signatures
```typescript
// Use explicit return types for public functions
export async function createUser(
  userData: CreateUserData,
  options?: CreateUserOptions
): Promise<User> {
  // Implementation
}

// Use arrow functions for callbacks and simple operations
const users = data.map((user: UserData) => new User(user));

// Use function declarations for hoisting when needed
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

#### Parameter Handling
```typescript
// Use destructuring for object parameters
async function updateUser(
  id: string,
  { name, email, ...otherFields }: UpdateUserData
): Promise<User> {
  // Implementation
}

// Use default parameters
function createLogger(
  level: LogLevel = LogLevel.INFO,
  transports: Transport[] = [new ConsoleTransport()]
): Logger {
  // Implementation
}

// Use rest parameters for variable arguments
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}
```

### Error Handling

#### Custom Exceptions
```typescript
import { LarascriptException } from '@larascript-framework/larascript-core';

export class ValidationException extends LarascriptException {
  constructor(message: string, public readonly errors?: string[]) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class UserNotFoundException extends LarascriptException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
    this.name = 'UserNotFoundException';
  }
}
```

#### Error Handling Patterns
```typescript
// Use try-catch for async operations
async function processUser(userId: string): Promise<User> {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return user;
  } catch (error) {
    logger.error('Failed to process user', { userId, error });
    throw error;
  }
}

// Use Result pattern for operations that can fail
type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

async function safeProcessUser(userId: string): Promise<Result<User>> {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      return {
        success: false,
        error: new UserNotFoundException(userId)
      };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## 🏗️ Architecture Patterns

### Service Layer Pattern
```typescript
// Service interface
interface IUserService {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

// Service implementation
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly validator: IValidator,
    private readonly logger: Logger
  ) {}

  async findById(id: string): Promise<User | null> {
    this.logger.debug('Finding user by ID', { id });
    
    const user = await this.userRepository.findById(id);
    
    this.logger.debug('User found', { id, found: !!user });
    return user;
  }

  async create(data: CreateUserData): Promise<User> {
    this.logger.info('Creating new user', { email: data.email });
    
    // Validate input
    await this.validator.validate(data);
    
    // Check for existing user
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new DuplicateEmailException(data.email);
    }
    
    // Create user
    const user = await this.userRepository.create(data);
    
    this.logger.info('User created successfully', { id: user.id });
    return user;
  }
}
```

### Repository Pattern
```typescript
// Repository interface
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(options?: FindAllOptions): Promise<User[]>;
}

// Repository implementation
export class UserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const result = await this.db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [data.name, data.email, data.passwordHash]
    );
    
    return new User(result.rows[0]);
  }
}
```

### Controller Pattern
```typescript
export class UserController extends BaseController {
  constructor(
    private readonly userService: IUserService,
    private readonly validator: IValidator
  ) {
    super();
  }

  async index(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.findAll();
      this.success(res, users);
    } catch (error) {
      this.error(res, error);
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validate input
      await this.validator.validate({ id });
      
      const user = await this.userService.findById(id);
      if (!user) {
        return this.notFound(res, 'User not found');
      }
      
      this.success(res, user);
    } catch (error) {
      this.error(res, error);
    }
  }

  async store(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validatedData = await this.validator.validate(req.body);
      
      const user = await this.userService.create(validatedData);
      this.created(res, user);
    } catch (error) {
      if (error instanceof ValidationException) {
        return this.validationError(res, error.errors);
      }
      this.error(res, error);
    }
  }
}
```

## 📁 File and Directory Structure

### File Naming
```typescript
// Use kebab-case for file names
user-service.ts
user-controller.ts
user-repository.ts
user-validator.ts

// Use PascalCase for class names
export class UserService {}
export class UserController {}
export class UserRepository {}
```

### Directory Structure
```
src/
├── services/
│   ├── user-service.ts
│   ├── auth-service.ts
│   └── index.ts
├── controllers/
│   ├── user-controller.ts
│   ├── auth-controller.ts
│   └── index.ts
├── repositories/
│   ├── user-repository.ts
│   ├── auth-repository.ts
│   └── index.ts
├── models/
│   ├── user.ts
│   ├── auth.ts
│   └── index.ts
├── validators/
│   ├── user-validator.ts
│   ├── auth-validator.ts
│   └── index.ts
└── utils/
    ├── string-utils.ts
    ├── date-utils.ts
    └── index.ts
```

### Index Files
```typescript
// services/index.ts
export { UserService } from './user-service';
export { AuthService } from './auth-service';
export type { IUserService } from './user-service';
export type { IAuthService } from './auth-service';

// Main index.ts
export * from './services';
export * from './controllers';
export * from './repositories';
export * from './models';
export * from './validators';
export * from './utils';
```

## 🔧 Code Organization

### Imports Order
```typescript
// 1. Node.js built-in modules
import { EventEmitter } from 'events';
import { readFileSync } from 'fs';
import { join } from 'path';

// 2. External dependencies
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// 3. Internal packages (workspace dependencies)
import { Logger } from '@larascript-framework/larascript-logger';
import { Validator } from '@larascript-framework/larascript-validator';
import { BaseService } from '@larascript-framework/larascript-core';

// 4. Relative imports (same package)
import { User } from '../models/user';
import { IUserRepository } from '../repositories/user-repository';
import { CreateUserData } from '../types/user';

// 5. Type imports
import type { Request, Response } from 'express';
import type { LogLevel } from '@larascript-framework/larascript-logger';
```

### Export Organization
```typescript
// 1. Re-exports from other modules
export { UserService } from './user-service';
export { AuthService } from './auth-service';

// 2. Type exports
export type { IUserService } from './user-service';
export type { IAuthService } from './auth-service';
export type { User, CreateUserData, UpdateUserData } from './types';

// 3. Constant exports
export const DEFAULT_USER_LIMIT = 10;
export const USER_ROLES = ['admin', 'user', 'guest'] as const;

// 4. Function exports
export function createUserService(): IUserService {
  return new UserService();
}

// 5. Class exports
export class UserManager {
  // Implementation
}
```

## 🧪 Testing Patterns

### Test Structure
```typescript
// user-service.test.ts
import { UserService } from '../user-service';
import { UserRepository } from '../user-repository';
import { ValidationException } from '@larascript-framework/larascript-core';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    userService = new UserService(mockUserRepository);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = new User({ id: userId, name: 'John' });
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.findById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = '123';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await userService.findById(userId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };
      const expectedUser = new User({ id: '123', ...userData });
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.create(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw ValidationException for invalid data', async () => {
      // Arrange
      const invalidData = { name: '', email: 'invalid-email' };

      // Act & Assert
      await expect(userService.create(invalidData))
        .rejects
        .toThrow(ValidationException);
    });
  });
});
```

## 📝 Documentation Standards

### JSDoc Comments
```typescript
/**
 * User service for managing user operations
 * 
 * @example
 * ```typescript
 * const userService = new UserService(userRepository);
 * const user = await userService.findById('123');
 * ```
 */
export class UserService {
  /**
   * Find a user by their ID
   * 
   * @param id - The unique identifier of the user
   * @returns Promise that resolves to the user or null if not found
   * 
   * @example
   * ```typescript
   * const user = await userService.findById('123');
   * if (user) {
   *   console.log(`Found user: ${user.name}`);
   * }
   * ```
   */
  async findById(id: string): Promise<User | null> {
    // Implementation
  }

  /**
   * Create a new user
   * 
   * @param userData - The user data to create
   * @param options - Optional creation options
   * @returns Promise that resolves to the created user
   * @throws {ValidationException} When user data is invalid
   * @throws {DuplicateEmailException} When email already exists
   * 
   * @example
   * ```typescript
   * const user = await userService.create({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   * ```
   */
  async create(
    userData: CreateUserData,
    options?: CreateUserOptions
  ): Promise<User> {
    // Implementation
  }
}
```

### README Documentation
```markdown
# User Service

Service for managing user operations including creation, retrieval, and updates.

## Installation

```bash
pnpm add @larascript-framework/larascript-core
```

## Usage

```typescript
import { UserService } from '@larascript-framework/larascript-core';

const userService = new UserService(userRepository);

// Find user by ID
const user = await userService.findById('123');

// Create new user
const newUser = await userService.create({
  name: 'John Doe',
  email: 'john@example.com'
});
```

## API Reference

### Class: UserService

#### Constructor

```typescript
constructor(userRepository: IUserRepository)
```

Creates a new UserService instance.

**Parameters:**
- `userRepository` (IUserRepository): Repository for user data access

#### Methods

##### `findById(id: string): Promise<User | null>`

Find a user by their ID.

**Parameters:**
- `id` (string): The unique identifier of the user

**Returns:**
- `Promise<User | null>`: The user if found, null otherwise

**Example:**
```typescript
const user = await userService.findById('123');
```

##### `create(userData: CreateUserData): Promise<User>`

Create a new user.

**Parameters:**
- `userData` (CreateUserData): The user data to create

**Returns:**
- `Promise<User>`: The created user

**Throws:**
- `ValidationException`: When user data is invalid
- `DuplicateEmailException`: When email already exists

**Example:**
```typescript
const user = await userService.create({
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Contributing

See [Contributing Guidelines](../../docs/contributing.md)
```

## 🔍 Code Review Checklist

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] No TODO comments (unless documented)
- [ ] Error handling is implemented
- [ ] Input validation is in place
- [ ] Performance considerations addressed

### During Review
- [ ] Code is readable and well-structured
- [ ] Naming conventions are followed
- [ ] Error handling is appropriate
- [ ] Security considerations are addressed
- [ ] Tests cover edge cases
- [ ] Documentation is clear and complete

---

**Remember**: The goal is to write code that is not only functional but also maintainable, readable, and follows established patterns. When in doubt, prioritize clarity and consistency over cleverness.
