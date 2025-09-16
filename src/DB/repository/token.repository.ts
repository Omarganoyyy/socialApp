import { Model } from "mongoose";
import { DatabaseRepository } from "./database.repository";
import {IToken as TDocument} from '../model/token.model'

export class TokenRepository extends DatabaseRepository<TDocument>
{
    constructor(protected override readonly model:Model<TDocument>){super(model)}
}