import ApiToken, { ApiTokenAttributes } from '@/app/models/auth/ApiToken.js';

class TestApiTokenModel extends ApiToken {
    constructor(data: ApiTokenAttributes | null = null) {
        super(data);
    }
}

export default TestApiTokenModel
