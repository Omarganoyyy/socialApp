"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetForgotPasswordCode = exports.verifyForgotPasswordCode = exports.sendForgotPasswordCode = exports.loginWithGmail = exports.signupWithGmail = exports.confirmEmail = exports.signup = exports.login = void 0;
const zod_1 = require("zod");
const validation_middleware_1 = require("../../middleware/validation.middleware");
exports.login = {
    body: zod_1.z.strictObject({
        email: validation_middleware_1.generalFields.email,
        password: validation_middleware_1.generalFields.password,
    }),
};
exports.signup = {
    body: zod_1.z
        .strictObject({
        username: validation_middleware_1.generalFields.username,
        email: validation_middleware_1.generalFields.email,
        password: validation_middleware_1.generalFields.password,
        confirmPassword: validation_middleware_1.generalFields.confirmPassword,
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
exports.confirmEmail = {
    body: zod_1.z.strictObject({
        email: validation_middleware_1.generalFields.email,
        otp: validation_middleware_1.generalFields.otp,
    }),
};
exports.signupWithGmail = {
    body: zod_1.z.strictObject({
        idToken: zod_1.z.string(),
    }),
};
exports.loginWithGmail = {
    body: zod_1.z.strictObject({
        idToken: zod_1.z.string(),
    }),
};
exports.sendForgotPasswordCode = {
    body: zod_1.z.strictObject({
        email: validation_middleware_1.generalFields.email,
    }),
};
exports.verifyForgotPasswordCode = {
    body: exports.sendForgotPasswordCode.body.extend({
        otp: validation_middleware_1.generalFields.otp,
    }),
};
exports.ResetForgotPasswordCode = {
    body: exports.verifyForgotPasswordCode.body.extend({
        otp: validation_middleware_1.generalFields.otp,
        password: validation_middleware_1.generalFields.password,
        confirmPassword: validation_middleware_1.generalFields.confirmPassword
    }).refine((data) => {
        return data.password === data.confirmPassword;
    }, { message: "password mismatch confirm-password", path: ["confirmPassword"] })
};
