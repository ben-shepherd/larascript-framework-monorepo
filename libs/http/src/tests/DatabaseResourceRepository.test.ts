import { DatabaseResourceRepository } from "@/http/resources/repository/DatabaseResourceRepository.js";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { testBootHttpService } from "./helpers/testBootHttpService.js";
import { MockModel } from "./repository/MockModel.js";
import { resetMockModelTable } from "./repository/resetMockModelTable.js";

describe("Database Resource Repository", () => {
  let repository: DatabaseResourceRepository;

  beforeEach(async () => {
    repository = new DatabaseResourceRepository({
      modelConstructor: MockModel,
    });

    await testBootHttpService({
      withDatabase: true,
    });

    await resetMockModelTable();
  });

  describe("createResource", () => {
    test("should create a resource", async () => {
      const resource = await repository.createResource({
        name: "Test",
        age: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(resource.name).toBe("Test");
      expect(resource.age).toBe(20);
      expect(resource.createdAt).toBeInstanceOf(Date);
      expect(resource.updatedAt).toBeInstanceOf(Date);
    })
  });
});
