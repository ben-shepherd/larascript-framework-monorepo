# @larascript-framework/larascript-events

A comprehensive event system for the Larascript framework that provides event dispatching, listening, and management capabilities with support for multiple drivers and worker services.

## Features

- **Event Dispatching**: Dispatch events with payload validation and driver support
- **Event Listening**: Register and manage event listeners
- **Multiple Drivers**: Support for different event drivers (sync, async, queue-based)
- **Worker Services**: Background processing capabilities for long-running events
- **Event Registry**: Centralized event registration and management
- **Payload Validation**: Automatic JSON serialization validation
- **Mock Support**: Built-in mocking for testing
- **TypeScript Support**: Full TypeScript support with type safety

## Installation

```bash
npm install @larascript-framework/larascript-events
```

## Quick Start

### Creating an Event

```typescript
import { BaseEvent, EventRegistry } from '@larascript-framework/larascript-events';

class UserCreatedEvent extends BaseEvent<{ userId: string; email: string }> {
  async execute(): Promise<void> {
    // Event execution logic
    console.log(`User created: ${this.getPayload().userId}`);
  }

  getQueueName(): string {
    return 'user-events';
  }
}

// Register the event with EventRegistry
export default EventRegistry.register(UserCreatedEvent);
```

### Dispatching Events

```typescript
import { EventService, EventConfig } from '@larascript-framework/larascript-events';

// Create event configuration
const config = EventConfig.create({
  defaultDriver: SyncDriver,
  drivers: {
    'sync': EventConfig.createConfigDriver(SyncDriver),
    'async': EventConfig.createConfigDriver(AsyncDriver),
    // Add custom queue driver implementation here if needed
  },
  listeners: []
});

// Create event service
const eventService = new EventService(config);

// Dispatch an event
const event = new UserCreatedEvent({ userId: '123', email: 'user@example.com' });
await eventService.dispatch(event);
```

### Event Registration

**Important**: All events must be registered with the `EventRegistry` to be properly managed by the event system. This is typically done in the event file's exports:

```typescript
// In your event file (e.g., UserCreatedEvent.ts)
import { BaseEvent, EventRegistry } from '@larascript-framework/larascript-events';

class UserCreatedEvent extends BaseEvent<{ userId: string; email: string }> {
  async execute(): Promise<void> {
    // Event execution logic
    console.log(`User created: ${this.getPayload().userId}`);
  }

  getQueueName(): string {
    return 'user-events';
  }
}

// Register the event with EventRegistry
export default EventRegistry.register(UserCreatedEvent);
```

This pattern ensures that:
- Events are automatically registered when imported
- The event system can discover and manage all events
- Events work properly with the static registry before the event service is available

### Creating Event Listeners

```typescript
import { BaseEventListener } from '@larascript-framework/larascript-events';

class UserCreatedListener extends BaseEventListener<{ userId: string; email: string }> {
  async execute(): Promise<void> {
    const payload = this.getPayload();
    
    // Send welcome email
    await this.sendWelcomeEmail(payload.email);
    
    // Update user count
    await this.updateUserCount();
  }

  private async sendWelcomeEmail(email: string): Promise<void> {
    // Email sending logic
  }

  private async updateUserCount(): Promise<void> {
    // Update logic
  }
}
```

## Core Components

### BaseEvent

The base class for all events. Provides payload validation, serialization, and basic event functionality.

```typescript
class MyEvent extends BaseEvent<MyPayloadType> {
  async execute(): Promise<void> {
    // Event logic here
  }

  getQueueName(): string {
    return 'my-queue';
  }
}
```

### EventService

The main service for managing and dispatching events.

```typescript
const eventService = new EventService(config);

// Dispatch events
await eventService.dispatch(event);

// Register listeners
eventService.registerListener(MyEvent, MyListener);

// Mock events for testing
eventService.mockEvent(MyEvent);
```

### EventRegistry

Central registry for managing event registration.

```typescript
import { EventRegistry } from '@larascript-framework/larascript-events';

// Register events
EventRegistry.register(MyEvent);

// Get registered events
const events = EventRegistry.getEvents();
```

### WorkerService

Background processing service for handling long-running events.

```typescript
import { WorkerService } from '@larascript-framework/larascript-events';

const workerService = new WorkerService(config);

// Start processing
await workerService.start();

// Stop processing
await workerService.stop();
```

## Configuration

### Event Configuration

```typescript
import { EventConfig } from '@larascript-framework/larascript-events';

const config = EventConfig.create({
  defaultDriver: SyncDriver,
  drivers: {
    'sync': EventConfig.createConfigDriver(SyncDriver),
    'async': EventConfig.createConfigDriver(AsyncDriver, {
      timeout: 5000,
      retries: 3
    })
  },
  listeners: [
    {
      event: UserCreatedEvent,
      listeners: [UserCreatedListener, EmailListener]
    }
  ]
});
```

### Driver Configuration

```typescript
// Create driver configuration
const driverConfig = EventConfig.createConfigDriver(MyDriver, {
  timeout: 10000,
  retries: 5,
  queue: 'high-priority'
});
```

## API Reference

### BaseEvent

#### Methods

- `execute()`: Execute the event logic
- `getPayload()`: Get the event payload
- `setPayload(payload)`: Set the event payload
- `getName()`: Get the event name
- `getQueueName()`: Get the queue name for the event
- `getDriverName()`: Get the driver name for the event
- `validatePayload()`: Validate the event payload

### EventService

#### Methods

- `dispatch(event, overrideDriverName?)`: Dispatch an event
- `registerListener(event, listener)`: Register an event listener
- `mockEvent(event)`: Mock an event for testing
- `getMockedEvents()`: Get mocked events
- `getConfig()`: Get the event configuration

### EventRegistry

#### Methods

- `register(event)`: Register an event
- `getEvents()`: Get all registered events
- `clear()`: Clear all registered events
- `isInitialized()`: Check if registry is initialized

## Testing

The package includes built-in mocking support for testing:

```typescript
// Mock events for testing
eventService.mockEvent(UserCreatedEvent);

// Dispatch events (they won't actually execute)
await eventService.dispatch(new UserCreatedEvent(payload));

// Check if events were dispatched
const dispatchedEvents = eventService.getMockedEvents();
expect(dispatchedEvents).toHaveLength(1);
```

## Error Handling

The package provides several exception classes:

- `EventInvalidPayloadException`: Thrown when event payload is invalid
- `EventDispatchException`: Thrown when event dispatch fails
- `EventNotDispatchedException`: Thrown when event is not dispatched

```typescript
try {
  await eventService.dispatch(event);
} catch (error) {
  if (error instanceof EventDispatchException) {
    // Handle dispatch error
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

ISC License - see the [LICENSE](LICENSE) file for details.