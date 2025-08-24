import { IUserAttributes, IUserModel, IUserRepository } from "@larascript-framework/larascript-auth";
import AuthenticableUser from "@src/app/models/auth/AuthenticableUser";
import Repository from "@src/core/base/Repository";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import { ModelConstructor } from "@src/core/domains/models/interfaces/IModel";

/**
 * Repository class for managing user data operations
 * 
 * This repository extends the base Repository class and implements IUserRepository interface.
 * It provides methods for creating, finding and managing user records in the database.
 * 
 * Key features:
 * - Create new user records
 * - Find users by ID with optional fail behavior
 * - Find users by email
 * - Uses Eloquent query builder for database operations
 * 
 * @extends Repository<IUserModel>
 * @implements IUserRepository
 */

class AuthenticationUserRepository<T extends AuthenticableUser> extends Repository<T> implements IUserRepository {

    constructor(modelConstructor: ModelConstructor<T>) {
        super(modelConstructor);
    }

    /**
     * Create a new user record
     * 
     * @param attributes - The attributes for the new user record
     * @returns The newly created user record
     */
    async create(attributes: IUserAttributes): Promise<T> {
        const user = this.modelConstructor.create(attributes as unknown as T['attributes'])
        await user.save()
        return user
    }

    /**
     * Find a user by their ID
     * 
     * @param id - The ID of the user to find
     * @returns The user record or null if not found
     */
    async findById(id: string | number): Promise<T | null> {
        return await queryBuilder(this.modelConstructor).find(id)
    }

    /**
     * Find a user by their ID and fail if not found
     * 
     * @param id - The ID of the user to find
     * @returns The user record
     */
    async findByIdOrFail(id: string | number): Promise<T> {
        return await queryBuilder(this.modelConstructor).findOrFail(id)
    }

    /**
     * Find a user by their email
     * 
     * @param email - The email of the user to find
     * @returns The user record or null if not found
     */
    async findByEmail(email: string): Promise<T | null> {
        return await queryBuilder(this.modelConstructor).where('email', email).first()
    }

}

export default AuthenticationUserRepository;


