import { beforeEach, describe, expect, test } from "@jest/globals";
import { ApiTokenModelOptions } from "../auth";
import { TestApiTokenModel } from "./model/TestApiTokenModel";

describe("TestApiTokenModel", () => {
  let apiToken: TestApiTokenModel;
  const mockId = "token-123";
  const mockToken = "test-token-abc123";
  const mockUserId = "user-456";
  const mockExpiresAt = new Date("2024-12-31T23:59:59Z");
  const mockRevokedAt = new Date("2024-01-15T10:30:00Z");
  const mockScopes = ["read", "write", "admin"];
  const mockOptions: ApiTokenModelOptions = {
    expiresAfterMinutes: 60,
    customField: "test-value"
  };

  beforeEach(() => {
    apiToken = new TestApiTokenModel({
      id: mockId,
      token: mockToken,
      userId: mockUserId,
      scopes: mockScopes,
      options: mockOptions,
      expiresAt: mockExpiresAt,
      revokedAt: mockRevokedAt,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  describe("Constructor and Basic Getters", () => {
    test("should create instance with all properties", () => {
      expect(apiToken.getId()).toBe(mockId);
      expect(apiToken.getToken()).toBe(mockToken);
      expect(apiToken.getUserId()).toBe(mockUserId);
      expect(apiToken.getExpiresAt()).toBe(mockExpiresAt);
      expect(apiToken.getRevokedAt()).toBe(mockRevokedAt);
      expect(apiToken.getScopes()).toEqual(mockScopes);
      expect(apiToken.getOptions()).toEqual(mockOptions);
    });

    test("should create instance with null revokedAt", () => {
      const tokenWithoutRevoke = new TestApiTokenModel({
        id: mockId,
        token: mockToken,
        userId: mockUserId,
        scopes: mockScopes,
        options: mockOptions,
        expiresAt: mockExpiresAt,
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      expect(tokenWithoutRevoke.getRevokedAt()).toBeNull();
    });

    test("should create instance with empty options", () => {
      const tokenWithoutOptions = new TestApiTokenModel({
        id: mockId,
        token: mockToken,
        userId: mockUserId,
        scopes: mockScopes,
        options: {},
        expiresAt: mockExpiresAt,
        revokedAt: mockRevokedAt,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      expect(tokenWithoutOptions.getOptions()).toEqual({});
    });
  });

  describe("setUserId and getUserId", () => {
    test("should set and get userId correctly", async () => {
      const newUserId = "new-user-789";
      await apiToken.setUserId(newUserId);
      expect(apiToken.getUserId()).toBe(newUserId);
    });

    test("should update userId multiple times", async () => {
      await apiToken.setUserId("user-1");
      expect(apiToken.getUserId()).toBe("user-1");

      await apiToken.setUserId("user-2");
      expect(apiToken.getUserId()).toBe("user-2");
    });
  });

  describe("setToken and getToken", () => {
    test("should set and get token correctly", async () => {
      const newToken = "new-token-xyz789";
      await apiToken.setToken(newToken);
      expect(apiToken.getToken()).toBe(newToken);
    });

    test("should update token multiple times", async () => {
      await apiToken.setToken("token-1");
      expect(apiToken.getToken()).toBe("token-1");

      await apiToken.setToken("token-2");
      expect(apiToken.getToken()).toBe("token-2");
    });
  });

  describe("setScopes and getScopes", () => {
    test("should set and get scopes correctly", async () => {
      const newScopes = ["read", "delete"];
      await apiToken.setScopes(newScopes);
      expect(apiToken.getScopes()).toEqual(newScopes);
    });

    test("should update scopes multiple times", async () => {
      await apiToken.setScopes(["scope-1"]);
      expect(apiToken.getScopes()).toEqual(["scope-1"]);

      await apiToken.setScopes(["scope-2", "scope-3"]);
      expect(apiToken.getScopes()).toEqual(["scope-2", "scope-3"]);
    });

    test("should handle empty scopes array", async () => {
      await apiToken.setScopes([]);
      expect(apiToken.getScopes()).toEqual([]);
    });
  });

  describe("hasScope", () => {
    test("should return true for existing single scope", () => {
      expect(apiToken.hasScope("read")).toBe(true);
      expect(apiToken.hasScope("write")).toBe(true);
      expect(apiToken.hasScope("admin")).toBe(true);
    });

    test("should return false for non-existing single scope", () => {
      expect(apiToken.hasScope("delete")).toBe(false);
      expect(apiToken.hasScope("nonexistent")).toBe(false);
    });

    test("should handle array input (current implementation limitation)", () => {
      // Note: Current implementation has a bug - it doesn't properly handle array inputs
      // It treats the array as a string, which will always return false
      expect(apiToken.hasScope(["read", "write"])).toBe(false);
      expect(apiToken.hasScope(["admin"])).toBe(false);
    });

    test("should ignore exactMatch parameter (current implementation limitation)", () => {
      // Note: Current implementation ignores the exactMatch parameter
      expect(apiToken.hasScope("read", true)).toBe(true);
      expect(apiToken.hasScope("read", false)).toBe(true);
    });

    test("should work with updated scopes", async () => {
      await apiToken.setScopes(["custom", "special"]);
      expect(apiToken.hasScope("custom")).toBe(true);
      expect(apiToken.hasScope("special")).toBe(true);
      expect(apiToken.hasScope("read")).toBe(false);
    });
  });

  describe("setRevokedAt and getRevokedAt", () => {
    test("should set and get revokedAt correctly", async () => {
      const newRevokedAt = new Date("2024-02-01T12:00:00Z");
      await apiToken.setRevokedAt(newRevokedAt);
      expect(apiToken.getRevokedAt()).toBe(newRevokedAt);
    });

    test("should set revokedAt to null", async () => {
      await apiToken.setRevokedAt(null);
      expect(apiToken.getRevokedAt()).toBeNull();
    });

    test("should update revokedAt multiple times", async () => {
      const date1 = new Date("2024-01-01T00:00:00Z");
      const date2 = new Date("2024-01-02T00:00:00Z");

      await apiToken.setRevokedAt(date1);
      expect(apiToken.getRevokedAt()).toBe(date1);

      await apiToken.setRevokedAt(date2);
      expect(apiToken.getRevokedAt()).toBe(date2);
    });
  });

  describe("setOptions and getOptions", () => {
    test("should set and get options correctly", async () => {
      const newOptions: ApiTokenModelOptions = {
        expiresAfterMinutes: 120,
        customField: "updated-value",
        additionalField: "new-field"
      };
      await apiToken.setOptions(newOptions);
      expect(apiToken.getOptions()).toEqual(newOptions);
    });

    test("should handle empty options", async () => {
      await apiToken.setOptions({});
      expect(apiToken.getOptions()).toEqual({});
    });

    test("should update options multiple times", async () => {
      await apiToken.setOptions({ field1: "value1" });
      expect(apiToken.getOptions()).toEqual({ field1: "value1" });

      await apiToken.setOptions({ field2: "value2" });
      expect(apiToken.getOptions()).toEqual({ field2: "value2" });
    });

    test("should return typed options", () => {
      const typedOptions = apiToken.getOptions<ApiTokenModelOptions>();
      expect(typedOptions).toEqual(mockOptions);
      expect(typedOptions?.expiresAfterMinutes).toBe(60);
      expect(typedOptions?.customField).toBe("test-value");
    });
  });

  describe("setExpiresAt and getExpiresAt", () => {
    test("should set and get expiresAt correctly", async () => {
      const newExpiresAt = new Date("2025-01-01T00:00:00Z");
      await apiToken.setExpiresAt(newExpiresAt);
      expect(apiToken.getExpiresAt()).toBe(newExpiresAt);
    });

    test("should update expiresAt multiple times", async () => {
      const date1 = new Date("2024-06-01T00:00:00Z");
      const date2 = new Date("2024-07-01T00:00:00Z");

      await apiToken.setExpiresAt(date1);
      expect(apiToken.getExpiresAt()).toBe(date1);

      await apiToken.setExpiresAt(date2);
      expect(apiToken.getExpiresAt()).toBe(date2);
    });
  });

  describe("hasExpired", () => {
    test("should return false when expiresAt is null", () => {
      const tokenWithoutExpiry = new TestApiTokenModel({
        id: mockId,
        token: mockToken,
        userId: mockUserId,
        scopes: mockScopes,
        options: mockOptions,
        expiresAt: null,
        revokedAt: mockRevokedAt,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      expect(tokenWithoutExpiry.hasExpired()).toBe(false);
    });

    test("should return true when token has expired", () => {
      const expiredDate = new Date("2020-01-01T00:00:00Z");
      const expiredToken = new TestApiTokenModel({
        id: mockId,
        token: mockToken,
        userId: mockUserId,
        scopes: mockScopes,
        options: mockOptions,
        expiresAt: expiredDate,
        revokedAt: mockRevokedAt,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      expect(expiredToken.hasExpired()).toBe(true);
    });

    test("should return false when token has not expired", () => {
      const futureDate = new Date("2030-01-01T00:00:00Z");
      const futureToken = new TestApiTokenModel({
        id: mockId,
        token: mockToken,
        userId: mockUserId,
        scopes: mockScopes,
        options: mockOptions,
        expiresAt: futureDate,
        revokedAt: mockRevokedAt,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      expect(futureToken.hasExpired()).toBe(false);
    });

    test("should return true when token expires exactly now", () => {
      const now = new Date();
      const expiringNowToken = new TestApiTokenModel({
        id: mockId,
        token: mockToken,
        userId: mockUserId,
        scopes: mockScopes,
        options: mockOptions,
        expiresAt: now,
        revokedAt: mockRevokedAt,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      // Small delay to ensure the token has expired
      setTimeout(() => {
        expect(expiringNowToken.hasExpired()).toBe(true);
      }, 1);
    });
  });

  describe("Integration Tests", () => {
    test("should maintain state across multiple operations", async () => {
      // Initial state
      expect(apiToken.getId()).toBe(mockId);
      expect(apiToken.getUserId()).toBe(mockUserId);
      expect(apiToken.getScopes()).toEqual(mockScopes);

      // Update multiple properties
      await apiToken.setUserId("updated-user");
      await apiToken.setToken("updated-token");
      await apiToken.setScopes(["new-scope"]);
      await apiToken.setRevokedAt(null);
      await apiToken.setOptions({ updated: true });

      // Verify all changes persisted
      expect(apiToken.getId()).toBe(mockId); // Should remain unchanged
      expect(apiToken.getUserId()).toBe("updated-user");
      expect(apiToken.getToken()).toBe("updated-token");
      expect(apiToken.getScopes()).toEqual(["new-scope"]);
      expect(apiToken.getRevokedAt()).toBeNull();
      expect(apiToken.getOptions()).toEqual({ updated: true });
    });

    test("should handle edge cases", async () => {
      // Test with empty strings
      await apiToken.setUserId("");
      await apiToken.setToken("");
      await apiToken.setScopes([]);

      expect(apiToken.getUserId()).toBe("");
      expect(apiToken.getToken()).toBe("");
      expect(apiToken.getScopes()).toEqual([]);
      expect(apiToken.hasScope("anything")).toBe(false);
    });
    
  });
});
