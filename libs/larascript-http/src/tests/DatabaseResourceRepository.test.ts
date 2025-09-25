import { DatabaseResourceRepository } from "@/http/resources/repository/DatabaseResourceRepository.js";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { TestHttpEnvironment } from "./helpers/TestHttpEnvironment.js";
import { MockModel } from "./repository/MockModel.js";
import { resetMockModelTable } from "./repository/resetMockModelTable.js";

describe("Database Resource Repository", () => {
  let repository: DatabaseResourceRepository;

  beforeEach(async () => {
    repository = new DatabaseResourceRepository({
      modelConstructor: MockModel,
    });

    await TestHttpEnvironment.create({
      withDatabase: true,
  }).boot();

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

  describe("createResourceWithoutSaving", () => {
    test("should create a resource without saving it", async () => {
      const resource = await repository.createResourceWithoutSaving({
        name: "Test",
        age: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(resource.id).toBeUndefined();
      expect(resource.name).toBe("Test");
      expect(resource.age).toBe(20);
    })
  });

  describe("getResource", () => {
    test("should get a resource", async () => {
      const model = await MockModel.create({
        name: "Test",
        age: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await model.save();

      const resource = await repository.getResource(model.id!);

      expect(resource?.name).toBe("Test");
      expect(resource?.age).toBe(20);
      expect(resource?.createdAt).toBeInstanceOf(Date);
      expect(resource?.updatedAt).toBeInstanceOf(Date);
    })
  });

  describe("updateResource", () => {
    test("should update a resource", async () => {
      const model = await MockModel.create({
        name: "Test",
        age: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await model.save();

      const resource = await repository.updateResource(model.id!, {
        name: "Test Updated",
        age: 21,
      });

      await model.refresh();

      expect(resource.name).toBe("Test Updated");
      expect(resource.age).toBe(21);
    })
  });

  describe("deleteResource", () => {
    test("should delete a resource", async () => {
      const model = await MockModel.create({
        name: "Test",
        age: 20,
      });
      await model.save();

      await repository.deleteResource(model.id!);

      const resource = await repository.getResource(model.id!);

      expect(resource).toBeUndefined();
    });
  });

  describe("getResources", () => {
    test("should get all resources", async () => {
      const model = await MockModel.create({
        name: "Test",
        age: 20,
      });
      await model.save();

      const model2 = await MockModel.create({
        name: "Test 2",
        age: 21,
      });
      await model2.save();

      const resources = await repository.getResources({});

      expect(resources.length).toBe(2);
      expect(resources[0].name).toBe("Test");
      expect(resources[1].name).toBe("Test 2");
    });
  });

  describe("getResourcesCount", () => {
    test("should get the count of resources", async () => {
      const model = await MockModel.create({
        name: "Test",
        age: 20,
      });
      await model.save();

      const count = await repository.getResourcesCount({});

      expect(count).toBe(1);

      const model2 = await MockModel.create({
        name: "Test 2",
        age: 21,
      });
      await model2.save();

      const count2 = await repository.getResourcesCount({});

      expect(count2).toBe(2);
    });
  });

  describe("getResourcesPage", () => {
    test("should get the page of resources", async () => {
      const model = await MockModel.create({
        name: "Test",
        age: 20,
      });
      await model.save();

      const model2 = await MockModel.create({
        name: "Test 2",
        age: 21,
      });
      await model2.save();

      const resources = await repository.getResourcesPage({}, 1, 10);

      expect(resources.length).toBe(2);
      expect(resources[0].name).toBe("Test");
      expect(resources[1].name).toBe("Test 2");
    });

    test("should skip the resources when on page 2", async () => {
      const model = await MockModel.create({
        name: "Test",
        age: 20,
      });
      await model.save();

      const model2 = await MockModel.create({
        name: "Test 2",
        age: 21,
      });
      await model2.save();

      const resources = await repository.getResourcesPage({}, 2, 1);

      expect(resources.length).toBe(1);
      expect(resources[0].name).toBe("Test 2");
    });
  });

  describe("stripSensitiveData", () => {
    test("should strip the sensitive data", async () => {
      const resource = await repository.stripSensitiveData({
        name: "Test",
        age: 20,
        secret: "Secret",
      });

      const strippedResource = await repository.stripSensitiveData(resource);

      expect(strippedResource.secret).toBeUndefined();
      expect(strippedResource.name).toBe("Test");
      expect(strippedResource.age).toBe(20);
    })
  });
});
