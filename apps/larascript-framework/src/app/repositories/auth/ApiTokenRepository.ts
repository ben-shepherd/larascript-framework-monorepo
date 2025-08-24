import { IApiTokenAttributes, IApiTokenModel, IApiTokenRepository } from "@larascript-framework/larascript-auth";
import ApiToken from "@src/app/models/auth/ApiToken";
import Repository from "@src/core/base/Repository";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";


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