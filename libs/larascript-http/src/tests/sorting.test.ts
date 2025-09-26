import SortOptions from "@/http/utils/SortOptions.js";
import { describe, expect, test } from "@jest/globals";

describe("Sorting Test Suite", () => {
  describe("Direction Normalization", () => {
    test("should normalize the direction", () => {
      const value = SortOptions.normalizeDirection('-1')
      expect(value).toBe('desc')

      const value2 = SortOptions.normalizeDirection('1')
      expect(value2).toBe('asc')

      const value3 = SortOptions.normalizeDirection('desc')
      expect(value3).toBe('desc')

      const value4 = SortOptions.normalizeDirection('asc')
      expect(value4).toBe('asc')

      const value5 = SortOptions.normalizeDirection('123')
      expect(value5).toBe('asc')
    })
  });
});
