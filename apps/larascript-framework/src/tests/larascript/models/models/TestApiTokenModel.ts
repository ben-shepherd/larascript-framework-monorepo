import ApiToken, { ApiTokenAttributes } from '@src/app/models/auth/ApiToken';

class TestApiTokenModel extends ApiToken {
    constructor(data: ApiTokenAttributes | null = null) {
        super(data);
    }
}

export default TestApiTokenModel
