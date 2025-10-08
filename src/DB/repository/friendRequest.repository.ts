import { DatabaseRespository } from "./database.repository";
import { IFriendRequest as TDocument } from "../model";
import { Model } from "mongoose";
export class FriendRequestRepository extends DatabaseRespository<TDocument>
{
    constructor(protected override readonly model:Model<TDocument>)
    {
        super(model)
    }
}