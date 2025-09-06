import { BaseInMemoryRepository } from "@larascript-framework/test-helpers";
import { IApiTokenModel } from "../../auth/index.js";
import { TestApiTokenModel } from "../model/TestApiTokenModel.js";

export class InMemoryApiTokenRepository extends BaseInMemoryRepository<TestApiTokenModel> {
  constructor() {
    super(TestApiTokenModel);
  }

  async findOneActiveToken(token: string): Promise<IApiTokenModel | null> {
    return (
      this.records.find(
        (apiToken) =>
          apiToken.getToken() === token &&
          false === apiToken.hasExpired() &&
          null === apiToken.getRevokedAt(),
      ) ?? null
    );
  }

  async revokeToken(apiToken: IApiTokenModel): Promise<void> {
    this.records = this.records.map((at) => {
      if (at.getId() === apiToken.getId()) {
        at.setRevokedAt(new Date());
      }
      return at;
    });
  }

  async revokeAllTokens(userId: string | number): Promise<void> {
    this.records = this.records.map((at) => {
      if (at.getUserId() === userId) {
        at.setRevokedAt(new Date());
      }
      return at;
    });
  }
}
