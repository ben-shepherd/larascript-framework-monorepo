import ResourceException from "@/http/exceptions/ResourceException.js";
import Http from "@/http/services/Http.js";
import { IEloquent } from "@larascript-framework/contracts/database/eloquent";
import { IModel } from "@larascript-framework/contracts/database/model";
import { DatabaseResourceRepositoryConfig, IDatabaseResourceRepository, IResourceData } from "@larascript-framework/contracts/http";
import { AbstractResourceRepository } from "../abstract/AbstractResourceRepository.js";


export class DatabaseResourceRepository extends AbstractResourceRepository implements IDatabaseResourceRepository
{
    declare config: DatabaseResourceRepositoryConfig;
    
    constructor(config: DatabaseResourceRepositoryConfig) {
        super(config);
    }
    
    get queryBuilder(): IEloquent<IModel> {
        return Http.getInstance().getQueryBuilderService().builder(this.config.modelConstructor);
    }

    get primaryKey(): string {
        return this.config.modelConstructor.getPrimaryKey();
    }

    async getResource(id: string): Promise<IResourceData | undefined> {
        return await this.toObject(
            (await this.queryBuilder.where(this.primaryKey, id).first()) ?? undefined
        );
    }

    async createResource(data: IResourceData): Promise<IResourceData> {
        const resource = this.config.modelConstructor.create(data)
        await resource.save();
        await resource.refresh();

        return await this.toObject(
            resource
        ) as IResourceData;
    }

    async updateResource(id: string, data: IResourceData): Promise<IResourceData> {
        const resource = await this.queryBuilder.where(this.primaryKey, id).first();

        if(!resource) {
            throw new ResourceException('Resource not found');
        }

        await resource.fill(data);
        await resource.save();

        return await this.toObject(resource) as IResourceData;
    }

    async deleteResource(id: string): Promise<void> {
        const resource = await this.queryBuilder.where(this.primaryKey, id).first();

        if(!resource) {
            throw new ResourceException('Resource not found');
        }

        await resource.delete();
    }

    async getResources(query: object): Promise<IResourceData[]> {
        return await this.toObjectArray(
            (await this.queryBuilder.where(query).get()).toArray()
        ) as IResourceData[];
    }

    getResourcesCount(query: object): Promise<number> {
        return this.queryBuilder.where(query).count();
    }
    
    async getResourcesPage(query: object, page: number, limit: number): Promise<IResourceData[]> {
        const skip = (page - 1) * limit;
        return await this.toObjectArray(
            (
                await this.queryBuilder
                .where(query)
                .skip(skip)
                .take(limit)
                .get()
            ).toArray()
        ) as IResourceData[];
    }
    
    private async toObject(model?: IModel): Promise<IResourceData | undefined> {
        if(!model) {
            return undefined;
        }
        return await model.toObject() as IResourceData;
    }

    private async toObjectArray(models?: IModel[]): Promise<IResourceData[]> {
        if(!models) {
            return [];
        }
        return await Promise.all(models.map(async (model) => await this.toObject(model))) as IResourceData[];
    }
}