import { HydratedDocument, model, models, Schema, Types } from "mongoose"
import { maxLength, minLength } from "zod"
import { IPost } from "./post.model"



export interface IComment{
    createdBy:Types.ObjectId
    postId:Types.ObjectId | Partial<IPost>
    commentId?:Types.ObjectId

    content?:string
    attachments?:string[]
   

    likes?:Types.ObjectId[]
    tags?:Types.ObjectId[]

    freezedAt?:Date
    freezedBy?:Types.ObjectId

    restoredAt?:Date
    restoredBy?:Types.ObjectId

    createdAt:Date
    updatedAt?:Date
}
export type HCommentDocument=HydratedDocument<IComment>

const commentSchema=new Schema<IComment>
({
    createdBy:{type:Schema.Types.ObjectId, ref:'User',required:true},
    postId:{type:Schema.Types.ObjectId,ref:"Post",required:true},
    commentId:{type:Schema.Types.ObjectId,ref:"Comment"},

    content:{type:String,minLength:2,maxLength:50000,required:function()
        {
            return !this.attachments?.length
        }
    },
   
    attachments:[String],
    
    likes:[{type:Schema.Types.ObjectId,ref:"User"}],
    tags:[{type:Schema.Types.ObjectId,ref:"User"}],


    
    freezedAt:Date,
    freezedBy:{type:Schema.Types.ObjectId,ref:"User"},

    restoredAt:Date,
    restoredBy:{type:Schema.Types.ObjectId,ref:"User"},

    createdAt:Date,
    updatedAt:Date,

},
{
    timestamps:true,
    strictQuery:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
})

commentSchema.pre(["find",'findOne',"countDocuments"],function (next)
{
    const query=this.getQuery()
    if(query.paranoid===false)
    {
        this.setQuery({...query})
    }
    else
    {
        this.setQuery({...query,freezedAt:{$exists:false}})
    }
    console.log(this.getQuery())

    next()
})

commentSchema.pre(["updateOne",'findOneAndUpdate'],function (next)
{
    const query=this.getQuery()
    if(query.paranoid===false)
    {
        this.setQuery({...query})
    }
    else
    {
        this.setQuery({...query,freezedAt:{$exists:false}})
    }
    next()
})

commentSchema.virtual("reply",{
    localField:"_id",
    foreignField:"commentId",
    ref:"Comment",
    justOne:true,
})

export const commentModel=models.comment || model<IComment>("comment",commentSchema) 