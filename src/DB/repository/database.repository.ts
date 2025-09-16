import { CreateOptions, DeleteResult, FlattenMaps, HydratedDocument, Model, MongooseUpdateQueryOptions, PopulateOption, PopulateOptions, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { BadRequestException } from "../../utils/response/error.response";
export type Lean<T>=HydratedDocument<FlattenMaps<T>>
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

    async findByIdAndUpdate({
        id,
        update,
        options={new:true},
    }:{
        id:Types.ObjectId
        update?:UpdateQuery<TDocument>
        options?:QueryOptions<TDocument>|null
    }):Promise<HydratedDocument<TDocument>|Lean<TDocument>|null>
    {
        return this.model.findByIdAndUpdate(
            id,
            {...update,$inc:{_v:1}},
            options
        )
    }

async deleteOne({
    filter,
}:{
    filter:RootFilterQuery<TDocument>
}):Promise<DeleteResult>
{
    return this.model.deleteOne(filter)
}
async findOneAndUpdate({
    filter,
    update,
    options={new :true},
}:{filter?:RootFilterQuery<TDocument>
    update?:UpdateQuery<TDocument>
    options?:QueryOptions<TDocument> | null
}):Promise<HydratedDocument<TDocument>|Lean<TDocument>|null>{
    return this.model.findOneAndUpdate(
        filter,
        {...update,$inc:{__v:1}},
        options,
    )
}

async find({
    filter,
    select,
    options,
  }: {
    filter?: RootFilterQuery<TDocument>;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }): Promise<Array<Lean<TDocument> | HydratedDocument<TDocument>> | null> {
    const doc = this.model.find(filter || {}).select(select || "");
    if (options?.populate) {
      doc.populate(options.populate as PopulateOptions[]);
    }
    if (options?.lean) {
      doc.lean(options.lean);
    }
    return await doc.exec();
  }


} 