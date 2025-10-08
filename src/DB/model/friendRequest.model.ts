import { HydratedDocument, model, models, Schema, Types } from "mongoose"
import { maxLength, minLength } from "zod"
import { IPost } from "./post.model"



export interface IFriendRequest{
    createdBy:Types.ObjectId
    sendTo:Types.ObjectId
    acceptedAt?:Date

    createdAt:Date
    updatedAt?:Date
}
export type HFriendRequest=HydratedDocument<IFriendRequest>

const friendRequestSchmena=new Schema<IFriendRequest>
({
    createdBy:{type:Schema.Types.ObjectId, ref:'User',required:true},
    sendTo:{type:Schema.Types.ObjectId, ref:'User',required:true},
    acceptedAt:Date,

    createdAt:Date,
    updatedAt:Date,

},
{
    timestamps:true,
    strictQuery:true,
})

friendRequestSchmena.pre(["find",'findOne',"countDocuments"],function (next)
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

friendRequestSchmena.pre(["updateOne",'findOneAndUpdate'],function (next)
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



export const FriendRequestModel=models.friendRequest || model<IFriendRequest>("FriendRequest",friendRequestSchmena) 