import { HydratedDocument, Model, PopulateOption, PopulateOptions, ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";
import { DatabaseRespository, Lean } from "./database.repository";
import {IPost as TDocument} from '../model/post.model'
import { CommentRepository } from "./comment.repository";
import { commentModel } from "../model";

export class PostRepository extends DatabaseRespository<TDocument>
{
    private commentModel=new CommentRepository(commentModel)
    constructor(protected override readonly model:Model<TDocument>){super(model)}

    async findCursor({
        filter,
        options,
        select,
    }:
{
    filter?:RootFilterQuery<TDocument>;
    select?:ProjectionType<TDocument> | undefined;
    options?:QueryOptions<TDocument> | undefined;
}):Promise<HydratedDocument<TDocument>[] | [] | Lean<TDocument>[] | any>{
    let result = [] 
    const cursor=this.model
    .find(filter || {})
    .select(select || "")
    .populate(options?.populate as PopulateOptions[])
    .cursor()
    for(let doc = await cursor.next(); doc!=null;await cursor.next())
    {
        const comments=await this.commentModel.find({
            filter:{postId:doc._id,commentId:{$exists:false}},
        })
        result.push({post:doc,comments})
    }
    return result
}
}