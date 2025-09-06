import { IApiTokenAttributes, IApiTokenModel, IApiTokenRepository } from "@larascript-framework/larascript-auth";
import { Repository } from "@larascript-framework/larascript-database";
import { queryBuilder } from "@src/core/services/QueryBuilder";
import ApiToken from "../../models/auth/ApiToken";


class ApiTokenRepository extends Repository<ApiToken> implements IApiTokenRepository {
    
    constructor() {
        super(ApiToken)
    }

    async create(attributes?: IApiTokenAttributes): Promise<IApiTokenModel> {
        const apiToken = this.modelConstructor.create(attributes as unknown as ApiToken['attributes'])
        await apiToken.save()
        return apiToken
    }

    async findOneActiveToken(token: string): Promise<IApiTokenModel | null> {
        return await queryBuilder(this.modelConstructor)
            .where(ApiToken.TOKEN, token)
            .where(ApiToken.REVOKED_AT, null)
            .first()
    }

    async revokeToken(apiToken: ApiToken): Promise<void> {
        await apiToken.setAttribute('revokedAt', new Date())
        await apiToken.save()
    }

    async revokeAllTokens(userId: string | number): Promise<void> {
        await queryBuilder(this.modelConstructor)
            .where(ApiToken.USER_ID, userId)
            .update({ [ApiToken.REVOKED_AT]: new Date() })
    }
}

export default ApiTokenRepository;