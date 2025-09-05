import type { NextFunction,Request,Response } from "express"
import { ZodError, ZodType } from "zod"
import { BadRequestException } from "../utils/response/error.response"
import {z} from 'zod'



type KeyReqType= keyof Request
type SchemaType =Partial<Record< KeyReqType,ZodType >>
type validationErrorsType=Array<{
    key:KeyReqType
    issues:Array<{
        message:string
        path:(string|number|symbol|undefined)[]
    }>
}>

export const validation =(schema:SchemaType)=>
{
return (req:Request,res:Response,next:NextFunction):NextFunction=>
{   

    const validationErrors:validationErrorsType=[]

    console.log(schema)
    console.log(Object.keys(schema))

    for(const key of Object.keys(schema) as KeyReqType[])
    {
        if(!schema[key])continue

        const validationResult = schema[key].safeParse(req[key])
        if(!validationResult.success)
        {
            const errors=validationResult.error as ZodError
            
            validationErrors.push({
                key,
                issues:errors.issues.map((issue)=>
                {
                    return {message:issue.message,path:issue.path}
                }),
            });
        }
    }
    if(validationErrors.length)
    {
        throw new BadRequestException("Validation Error",{
            validationErrors
        })
    }

     
    return next() as unknown as NextFunction
}
}

 export const generalFields={
     username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters." })
        .max(20, { message: "Username must be at most 20 characters." }),

      email: z
        .string()
        .email({ message: "Valid email must be like ooooooo@gmail.com" }),

      password: z
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
          message:
            "Password must be at least 8 characters, include upper, lower, and a number.",
        }),

      confirmPassword: z.string(),

      otp:z.string().regex(/^\d{}$/)
 }