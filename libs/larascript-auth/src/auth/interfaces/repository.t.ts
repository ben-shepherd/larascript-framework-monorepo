import { IApiTokenModel, IUserModel } from "."

export interface IApiTokenRepository {
    findOneActiveToken(token: string): Promise<IApiTokenModel | null>
    revokeToken(apiToken: IApiTokenModel): Promise<void>
    revokeAllTokens(userId: string | number): Promise<void>
}

export interface IUserRepository {
    create(attributes?: IUserModel): IUserModel
    findById(id: string | number): Promise<IUserModel | null>
    findByIdOrFail(id: string | number): Promise<IUserModel>
    findByEmail(email: string): Promise<IUserModel | null>
}

