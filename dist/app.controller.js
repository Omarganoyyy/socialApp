"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: (0, node_path_1.resolve)("./config/.env.development") });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
//import authController from "./modules/auth/auth.controller"
//import userController from './modules/user/user.controller'
const error_response_1 = require("./utils/response/error.response");
const connection_db_1 = __importDefault(require("./DB/connection.db"));
const node_util_1 = require("node:util");
const node_stream_1 = require("node:stream");
const s3_config_1 = require("./utils/multer/s3.config");
const auth_1 = require("./modules/auth");
const user_1 = require("./modules/user");
const post_1 = require("./modules/post");
const createS3WriteStreamPipe = (0, node_util_1.promisify)(node_stream_1.pipeline);
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 6000,
    max: 2000,
    message: {
        error: "Too Many Requests, Try again later,"
    },
    statusCode: 409,
});
const bootstrap = async () => {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 5000;
    app.use((0, cors_1.default)(), express_1.default.json(), (0, helmet_1.default)(), limiter);
    app.get("/", (req, res) => {
        res.json({
            message: `Welcome to ${process.env.APPLICATION_NAME} backend landing page`
        });
    });
    app.use("/auth", auth_1.router);
    app.use("/user", user_1.router);
    app.use('/post', post_1.router);
    app.get("/upload/*path", async (req, res) => {
        const { downloadName, download = "false" } = req.query;
        const { path } = req.params;
        const Key = path.join("/");
        const s3Response = await (0, s3_config_1.getFile)({ Key });
        console.log(s3Response.Body);
        if (!s3Response?.Body) {
            throw new error_response_1.BadRequestException("fail to fetch this asset");
        }
        res.setHeader('content-type', `${s3Response.ContentType || "application\octet-stream"}`);
        if (download === "true") {
            res.setHeader("Content-Disposition", `attachment; filename="${downloadName || Key.split("/").pop()}"`);
        }
        return await createS3WriteStreamPipe(s3Response.Body, res);
    });
    app.get("/upload/pre-signed/*path", async (req, res) => {
        const { downloadName, download = "false", expiresIn = 120 } = req.query;
        const { path } = req.params;
        const Key = path.join("/");
        const url = await (0, s3_config_1.createGetPreSignedLink)({ Key,
            download,
            downloadName: downloadName,
            expiresIn, });
        return res.json({ message: "Done", data: { url } });
    });
    app.use("{/*dummy}", (req, res) => {
        return res.status(404).json({ message: "In-valid App Routing" });
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ::: ${port}`);
    });
    await (0, connection_db_1.default)();
    app.use(error_response_1.globalErrorHandling);
};
exports.default = bootstrap;
