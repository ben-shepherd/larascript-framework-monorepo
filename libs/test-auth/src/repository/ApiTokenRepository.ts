import ApiToken from "@/models/ApiToken.js";
import { TestAuthEnvironment } from "@/test-auth/TestAuthEnvironment.js";
import { IApiTokenAttributes, IApiTokenModel, IApiTokenRepository } from "@larascript-framework/larascript-auth";
import { Repository } from "@larascript-framework/larascript-database";

class ApiTokenRepository extends Repository<ApiToken> implements IApiTokenRepository {
    
    constructor() {
        super(ApiToken)
    }

    get queryBuilder() {
        return TestAuthEnvironment.getInstance().eloquentQueryBuilderService.builder(this.modelConstructor);
    }

    async create(attributes?: IApiTokenAttributes): Promise<IApiTokenModel> {
        const apiToken = this.modelConstructor.create(attributes as unknown as ApiToken['attributes'])
        await apiToken.save()
        return apiToken
    }

    async findOneActiveToken(token: string): Promise<IApiTokenModel | null> {
        return await this.queryBuilder
            .where(ApiToken.TOKEN, token)
            .whereNull(ApiToken.REVOKED_AT)
            .first()
    }

    async revokeToken(apiToken: ApiToken): Promise<void> {
        await apiToken.setAttribute('revokedAt', new Date())
        await apiToken.save()
    }

    async revokeAllTokens(userId: string | number): Promise<void> {
        await this.queryBuilder
            .where(ApiToken.USER_ID, userId)
            .update({ [ApiToken.REVOKED_AT]: new Date() })
    }
}

export default ApiTokenRepository;