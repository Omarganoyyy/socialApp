"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.validation = void 0;
const error_response_1 = require("../utils/response/error.response");
const zod_1 = require("zod");
const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        console.log(schema);
        console.log(Object.keys(schema));
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const validationResult = schema[key].safeParse(req[key]);
            if (!validationResult.success) {
                const errors = validationResult.error;
                validationErrors.push({
                    key,
                    issues: errors.issues.map((issue) => {
                        return { message: issue.message, path: issue.path };
                    }),
                });
            }
        }
        if (validationErrors.length) {
            throw new error_response_1.BadRequestException("Validation Error", {
                validationErrors
            });
        }
        return next();
    };
};
exports.validation = validation;
exports.generalFields = {
    username: zod_1.z
        .string()
        .min(2, { message: "Username must be at least 2 characters." })
        .max(20, { message: "Username must be at most 20 characters." }),
    email: zod_1.z
        .string()
        .email({ message: "Valid email must be like ooooooo@gmail.com" }),
    password: zod_1.z
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message: "Password must be at least 8 characters, include upper, lower, and a number.",
    }),
    confirmPassword: zod_1.z.string(),
    otp: zod_1.z.string().regex(/^\d{}$/)
};
