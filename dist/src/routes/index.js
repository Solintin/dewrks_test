"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = require("../configs");
const errors_1 = require("../errors");
const system_middleware_1 = __importDefault(require("../middlewares/system.middleware"));
const express_1 = require("express");
const os_1 = __importDefault(require("os"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const task_routes_1 = __importDefault(require("./task.routes"));
class Routes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.apiVersion = "/api/v1";
        this.route();
    }
    route() {
        this.router.use(system_middleware_1.default.rateLimiter());
        this.router.use(system_middleware_1.default.filterMiddleware);
        this.router.get("/", this.index);
        this.router.use(`${this.apiVersion}/auth`, auth_routes_1.default);
        this.router.use(`${this.apiVersion}/task`, task_routes_1.default);
        this.router.use("*", (req) => {
            throw new errors_1.NotFoundError(`You missed the road Cannot ${req.method} ${req.originalUrl} on this server`);
        });
    }
    index(_req, res) {
        return res.status(200).json({
            message: `Welcome to Task Management API.`,
            data: {
                port: configs_1.serverConfig.PORT,
                container_hostname: os_1.default.hostname(),
                processId: process.pid,
                environment: configs_1.serverConfig.NODE_ENV,
                version: configs_1.serverConfig.APP_VERSION,
            },
        });
    }
}
exports.default = new Routes().router;
