import { IApiTokenFactory, IUserFactory } from "@/auth/interfaces/factory";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { TestApiTokenFactory } from "./factory/TestApiTokenFactory";
import { TestUserFactory } from "./factory/TestUserFactory";

describe("Factory", () => {
  let userFactory: IUserFactory;
  let apiTokenFactory: IApiTokenFactory;

  beforeEach(async () => {
    userFactory = new TestUserFactory();
    apiTokenFactory = new TestApiTokenFactory();
  });

  test("should create and return a user", async () => {
    const user = userFactory.create({
      email: "test@test.com",
      hashedPassword: "password",
      aclRoles: [],
      aclGroups: [],
    });
    expect(user).toBeDefined();
    expect(user?.getEmail()).toBe("test@test.com");
    expect(user?.getHashedPassword()).toBe("password");
  });

  test("should create and return a api token", async () => {
    const apiToken = apiTokenFactory.create({
      token: "token",
      scopes: [],
      options: {},
    });

    expect(apiToken).toBeDefined();
    expect(apiToken?.getToken()).toBe("token");
    expect(apiToken?.getScopes()).toEqual([]);
    expect(apiToken?.getOptions()).toEqual({});
  });
});
