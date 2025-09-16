import { NextFunction, Request,Response } from "express";


export interface IError extends Error{
    
        statusCode:number;
}

export class ApplicationException extends Error
{
    constructor(
        message:string,
        public statusCode:Number=400,
        cause?:unknown
    )
    {
        super(message,{cause})
        this.name=this.constructor.name
        Error.captureStackTrace(this,this.constructor)
    }
}

export class BadRequestException extends ApplicationException
{
    constructor(message:string,cause?:unknown)
    {
        super(message,400,cause)
    }
}

export class NotFoundException extends ApplicationException{
constructor(message:string,cause?:unknown){
    super(message,404,cause)
}
}

export class UnauthorizedException extends ApplicationException{
constructor(message:string,cause?:unknown){
    super(message,401,cause)
}
}

export class ForbiddenException extends ApplicationException{
constructor(message:string,cause?:unknown){
    super(message,403,cause)
}
}

export class ConflictException extends ApplicationException{
constructor(message:string,cause?:unknown){
    super(message,404,cause)
}
}


//global error handling
export const globalErrorHandling=
((error:Error,req:Request,res:Response,next:NextFunction)=>
{
    return res.status(500).json({err_message:error.message||"Something went wrong",stack:process.env.MOOD==="development"?error.stack:undefined,error})
})


class parent{
    constructor(public name?:string){}
    getName()
    {
        return this.name
    }
}
class Child extends parent{
    constructor(public override name:string)
    {
        super()
    }
}
const c=new Child("Omar")
console.log(c.getName())