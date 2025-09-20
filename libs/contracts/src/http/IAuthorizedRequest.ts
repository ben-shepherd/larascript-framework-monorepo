
import { IApiTokenModel, IUserModel } from '@larascript-framework/larascript-auth';
import { Request } from 'express';

export default interface IAuthorizedRequest extends Request {
    user?: IUserModel | null;
    apiToken?: IApiTokenModel | null;
}