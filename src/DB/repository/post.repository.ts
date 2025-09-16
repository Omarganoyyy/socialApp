import { Model } from "mongoose";
import { DatabaseRepository } from "./database.repository";
import {IPost as TDocument} from '../model/post.model'

export class PostRepository extends DatabaseRepository<TDocument>
{
    constructor(protected override readonly model:Model<TDocument>){super(model)}
}