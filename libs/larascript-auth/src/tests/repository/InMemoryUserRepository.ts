import { BaseInMemoryRepository } from "@larascript-framework/test-helpers";
import { IUserModel, IUserRepository } from "../../auth";
import TestUserModel from "../model/TestUserModel";


export class InMemoryUserRepository extends BaseInMemoryRepository<TestUserModel> implements IUserRepository {
    constructor() {
        super(TestUserModel);
    }
    
    async findById(id: string | number): Promise<IUserModel | null> {
        return this.records.find(user => user.getId() === id) ?? null;
    }

    async findByIdOrFail(id: string | number): Promise<IUserModel> {
        const user = await this.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async findByEmail(email: string): Promise<IUserModel | null> {
        return this.records.find(user => user.getEmail() === email) ?? null;
    }
}