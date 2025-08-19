import { beforeEach, describe, expect, test, jest } from "@jest/globals";
import { BaseEvent } from "../events/base/BaseEvent";
import { EventInvalidPayloadException } from "../events/exceptions/EventInvalidPayloadException";
import { EventRegistry } from "../events/registry/EventRegistry";

// Mock dependencies
jest.mock("@larascript-framework/larascript-core", () => ({
  AppSingleton: {
    safeContainer: jest.fn(() => ({
      getDefaultDriverCtor: jest.fn(() => class MockDriver {})
    }))
  }
}));

jest.mock("@larascript-framework/larascript-utils", () => ({
  BaseCastable: class MockBaseCastable {
    getCastFromObject = jest.fn((data) => data);
    getCast = jest.fn((data) => data);
    isValidType = jest.fn(() => true);
  },
  TCastableType: {},
  TCasts: {},
  TClassConstructor: {}
}));

// Create a concrete implementation for testing
class TestEvent extends BaseEvent<{ message: string; count: number }> {
  getName(): string {
    return "TestEvent";
  }

  getDriverCtor(): any {
    return this.driver;
  }

  async execute(): Promise<void> {
    // Test implementation
  }
}

describe("BaseEvent", () => {
  beforeEach(() => {
    EventRegistry.clear();
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("should create event with valid payload", () => {
      const payload = { message: "test", count: 42 };
      const event = new TestEvent(payload);
      
      expect(event.getPayload()).toEqual(payload);
      expect(event.getName()).toBe("TestEvent");
    });

    test("should create event with null payload", () => {
      const event = new TestEvent(null);
      
      expect(event.getPayload()).toBeNull();
    });

    test("should throw EventInvalidPayloadException for invalid payload", () => {
      const invalidPayload = { func: () => {} }; // Function is not JSON serializable
      
      expect(() => new TestEvent(invalidPayload)).toThrow(EventInvalidPayloadException);
    });

    test("should auto-register event in EventRegistry", () => {
      new TestEvent();
      
      const registeredEvents = EventRegistry.getEvents();
      expect(registeredEvents).toContain(TestEvent);
    });
  });

  describe("validatePayload", () => {
    test("should return true for valid JSON payloads", () => {
      const validPayloads = [
        { message: "test" },
        { count: 42, nested: { value: true } },
        [1, 2, 3],
        "string",
        123,
        true,
        null
      ];

      validPayloads.forEach(payload => {
        const event = new TestEvent(payload);
        expect(event.validatePayload()).toBe(true);
      });
    });

    test("should return false for invalid JSON payloads", () => {
      const invalidPayloads = [
        { func: () => {} },
        { symbol: Symbol("test") },
        { undefined: undefined },
        { circular: null }
      ];

      // Set up circular reference
      const circular: any = {};
      circular.self = circular;
      invalidPayloads.push(circular);

      invalidPayloads.forEach(payload => {
        const event = new TestEvent(payload);
        expect(event.validatePayload()).toBe(false);
      });
    });
  });

  describe("getPayload", () => {
    test("should return the payload with casting", () => {
      const payload = { message: "test", count: 42 };
      const event = new TestEvent(payload);
      
      const result = event.getPayload();
      expect(result).toEqual(payload);
    });
  });

  describe("setPayload", () => {
    test("should set the payload", () => {
      const event = new TestEvent();
      const newPayload = { message: "new", count: 100 };
      
      event.setPayload(newPayload);
      expect(event.getPayload()).toEqual(newPayload);
    });
  });

  describe("getQueueName", () => {
    test("should return default queue name", () => {
      const event = new TestEvent();
      expect(event.getQueueName()).toBe("default");
    });
  });

  describe("execute", () => {
    test("should execute without throwing error", async () => {
      const event = new TestEvent();
      await expect(event.execute()).resolves.toBeUndefined();
    });
  });
});
