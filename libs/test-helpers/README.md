# @larascript-framework/test-helpers

A collection of test helper utilities for the Larascript framework, providing base classes and interfaces for creating in-memory test implementations.

## Installation

This package is part of the Larascript monorepo and is available as a workspace dependency:

```bash
pnpm add @larascript-framework/test-helpers
```

## Features

### BaseModel

A base model class that provides common functionality for test models with attributes management.

```typescript
import { BaseModel, BaseModelAttributes } from '@larascript-framework/test-helpers';

interface UserAttributes extends BaseModelAttributes {
  name: string;
  email: string;
}

class User extends BaseModel<UserAttributes> {
  // Your user-specific methods here
}

const user = new User({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### BaseInMemoryRepository

An abstract base class for creating in-memory repositories for testing purposes.

```typescript
import { BaseInMemoryRepository, BaseModel } from '@larascript-framework/test-helpers';

class UserRepository extends BaseInMemoryRepository<User> {
  constructor() {
    super(User);
  }
  
  // Add your repository-specific methods here
}

const userRepo = new UserRepository();

// Create a new user
const user = userRepo.create({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Update a user
userRepo.update('id', '1', { name: 'Jane Doe' });

// Delete a user
userRepo.delete('id', '1');

// Set test data
userRepo.setRecords([user1, user2, user3]);

// Get all records
const allUsers = userRepo.getRecords();

// Clear all records
userRepo.clearRecords();
```

## API Reference

### BaseModel

#### `BaseModelAttributes`
Interface defining the base attributes that all models should have:
- `id: string` - Unique identifier
- `createdAt: Date` - Creation timestamp
- `updatedAt: Date` - Last update timestamp

#### `IBaseModel<Attributes>`
Interface defining the contract for base models:
- `attributes: Attributes` - The model's attributes
- `setAttributes(attributes: Attributes): void` - Set the model's attributes
- `getAttributes(): Attributes` - Get the model's attributes
- `getId(): string` - Get the model's ID
- `getCreatedAt(): Date` - Get the creation date
- `getUpdatedAt(): Date` - Get the last update date

#### `BaseModel<Attributes>`
Concrete implementation of `IBaseModel` that provides the base functionality.

### BaseInMemoryRepository

#### `IBaseInMemoryRepository<T>`
Interface defining the contract for in-memory repositories:
- `update(where: string, value: unknown, data: Partial<T['attributes']>): void` - Update records matching criteria
- `delete(where: string, value: unknown): void` - Delete records matching criteria
- `setRecords(data: T[]): void` - Set the repository's records
- `getRecords(): T[]` - Get all records
- `clearRecords(): void` - Clear all records

#### `BaseInMemoryRepository<T>`
Abstract base class implementing `IBaseInMemoryRepository` with additional methods:
- `create(attributes: T['attributes']): T` - Create and store a new record
- `constructor(model: IBaseModelConstructor<T>)` - Initialize with a model constructor

## Usage Examples

### Creating a Test Model

```typescript
import { BaseModel, BaseModelAttributes } from '@larascript-framework/test-helpers';

interface ProductAttributes extends BaseModelAttributes {
  name: string;
  price: number;
  category: string;
}

class Product extends BaseModel<ProductAttributes> {
  getName(): string {
    return this.attributes.name;
  }
  
  getPrice(): number {
    return this.attributes.price;
  }
  
  getCategory(): string {
    return this.attributes.category;
  }
}
```

### Creating a Test Repository

```typescript
import { BaseInMemoryRepository } from '@larascript-framework/test-helpers';

class ProductRepository extends BaseInMemoryRepository<Product> {
  constructor() {
    super(Product);
  }
  
  findByCategory(category: string): Product[] {
    return this.getRecords().filter(product => 
      product.getCategory() === category
    );
  }
  
  findByName(name: string): Product | undefined {
    return this.getRecords().find(product => 
      product.getName() === name
    );
  }
}
```

### Setting Up Test Data

```typescript
describe('ProductRepository', () => {
  let repository: ProductRepository;
  
  beforeEach(() => {
    repository = new ProductRepository();
    
    // Set up test data
    repository.setRecords([
      new Product({
        id: '1',
        name: 'Laptop',
        price: 999.99,
        category: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      new Product({
        id: '2',
        name: 'Desk Chair',
        price: 199.99,
        category: 'Furniture',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ]);
  });
  
  afterEach(() => {
    repository.clearRecords();
  });
  
  it('should find products by category', () => {
    const electronics = repository.findByCategory('Electronics');
    expect(electronics).toHaveLength(1);
    expect(electronics[0].getName()).toBe('Laptop');
  });
});
```

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Contributing

This package follows the Larascript monorepo conventions:

- All TypeScript source files are in the `src` directory
- Exports are defined in `src/index.ts`
- Tests are in the `src/tests` directory
- Configuration extends from the base monorepo configs

## License

ISC