"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = void 0;
//global error handling
exports.globalErrorHandling = ((error, req, res, next) => {
    return res.status(500).json({ err_message: error.message || "Something went wrong", stack: process.env.MOOD === "development" ? error.stack : undefined, error });
});
