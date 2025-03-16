"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const express_1 = require("express");
const task_validator_1 = __importDefault(require("../validations/task.validator"));
const system_middleware_1 = __importDefault(require("../middlewares/system.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
class TaskRoutes extends task_controller_1.default {
    constructor() {
        super();
        this.router = (0, express_1.Router)({ mergeParams: true });
        this.routes();
    }
    routes() {
        this.router.get("/", auth_middleware_1.default.validateUserAccess, this.index.bind(this));
        this.router.get("/overview", auth_middleware_1.default.validateUserAccess, this.overview.bind(this));
        this.router.post("/", system_middleware_1.default.validateRequestBody(task_validator_1.default.create), auth_middleware_1.default.validateUserAccess, this.create.bind(this));
        this.router.patch("/:taskId", system_middleware_1.default.validateParamId("taskId"), system_middleware_1.default.validateRequestBody(task_validator_1.default.update), this.update.bind(this));
        this.router.delete("/:taskId", auth_middleware_1.default.validateUserAccess, system_middleware_1.default.validateParamId("taskId"), this.delete.bind(this));
        this.router.get("/:taskId", auth_middleware_1.default.validateUserAccess, system_middleware_1.default.validateParamId("taskId"), this.get.bind(this));
    }
}
exports.default = new TaskRoutes().router;
