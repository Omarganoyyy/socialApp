import { z } from "zod";
import { generalFields } from "../../middleware/validation.middleware";


export const login = {
  body: z.strictObject({
    email: generalFields.email,
    password: generalFields.password,
  }),
};

 
export const signup = {
  body: z
    .strictObject({
      username: generalFields.username,
      email: generalFields.email,
      password: generalFields.password,
      confirmPassword: generalFields.confirmPassword,
    })
    .superRefine((data, ctx) => {
      
      if (data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Password and confirm password do not match.",
        });
      }

      
      if (data.username.trim().split(/\s+/).length !== 2) {
        ctx.addIssue({
          code: "custom",
          path: ["username"],
          message: "Username must consist of 2 parts like: JON DOE",
        });
      }
    }),
};


export const confirmEmail = {
  body: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
  }),
};

export const signupWithGmail = {
  body: z.strictObject({
    idToken:z.string(),
  }),
};

export const loginWithGmail = {
  body: z.strictObject({
    idToken:z.string(),
  }),
};

export const sendForgotPasswordCode = {
  body: z.strictObject({
    email:generalFields.email,
  }),
};

export const verifyForgotPasswordCode = {
  body: sendForgotPasswordCode.body.extend({
    otp:generalFields.otp,
  }),
};

export const ResetForgotPasswordCode = {
  body: verifyForgotPasswordCode.body.extend({
    otp:generalFields.otp,
    password:generalFields.password,
    confirmPassword:generalFields.confirmPassword
  }).refine((data)=>
  {
    return data.password===data.confirmPassword
},{message:"password mismatch confirm-password",path:["confirmPassword"]})
};