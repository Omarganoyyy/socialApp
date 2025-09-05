import { CreateOptions, FlattenMaps, HydratedDocument, Model, MongooseUpdateQueryOptions, PopulateOption, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { BadRequestException } from "../../utils/response/error.response";

export class DatabaseRepository<TDocument>
{
    constructor(protected readonly model:Model<TDocument>){}

    async findOne
    ({
        filter,
        select,
        options,
        
    }:{
        filter?:RootFilterQuery<TDocument>
        select?:ProjectionType<TDocument>
        options?:QueryOptions<TDocument>
    }):Promise<HydratedDocument<FlattenMaps<TDocument>>|HydratedDocument<TDocument>|null>
    {
        const doc=this.model.findOne(filter).select(select||"")
        // if(options?.populate)
        // {
        //     doc.populate(options.populate)  
        // }
        if(options?.lean)
            {
                doc.lean(options.lean)
            } //mabetraga3s el extras zy username w last name only returns email and id
            return await doc.exec()
    }


    async create({
        data,
        options
    }:{
        data:Partial<TDocument>[]
        options?:CreateOptions | undefined
    }):Promise<HydratedDocument<TDocument>[]|undefined>
    {
        return await this.model.create(data,options)
    }
    
     
async updateOne({
    filter,
    update,
    options,

}:{
    filter:RootFilterQuery<TDocument>
    update:UpdateQuery<TDocument>
    options?:MongooseUpdateQueryOptions<TDocument>|null
}):Promise<UpdateWriteOpResult>
{
return await this.model.updateOne(filter,{...update,$inc:{_v:1}},options)
}
    
} 