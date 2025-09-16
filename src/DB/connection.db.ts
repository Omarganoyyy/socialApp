import {connect} from "mongoose"
import {log} from "node:console"
import { UserModel } from "./model/user.model"

const connectDB=async():Promise<void>=>
{
    try{
        const result=await connect(process.env.DB_URI as string,{
            serverSelectionTimeoutMS:30000
        })
        await UserModel.syncIndexes()
        console.log(result.models);
        console.log("DB Connected Successfully.")
    }catch(error)
    {
        console.log(`Fail To Connect on DB`)
    }
}
export default connectDB