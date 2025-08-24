import { IFactory } from "@larascript-framework/larascript-core";
import { generateUuidV4 } from "@larascript-framework/larascript-utils";
import { IUserAttributes, IUserModel } from "../../auth";
import TestUserModel from "../model/TestUserModel";

export class TestUserFactory implements IFactory<IUserModel> {
  getDefinition(): unknown {
    return {};
  }

  create(attributes?: IUserAttributes): IUserModel {
    return new TestUserModel({
      id: attributes?.id ?? generateUuidV4(),
      email: attributes?.email ?? "",
      hashedPassword: attributes?.hashedPassword ?? "",
      aclRoles: attributes?.aclRoles ?? [],
      aclGroups: attributes?.aclGroups ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
