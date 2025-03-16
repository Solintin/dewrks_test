"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const express_1 = require("express");
const auth_validator_1 = __importDefault(require("../validations/auth.validator"));
const system_middleware_1 = __importDefault(require("../middlewares/system.middleware"));
class AuthRoutes extends auth_controller_1.default {
    constructor() {
        super();
        this.router = (0, express_1.Router)({ mergeParams: true });
        this.routes();
    }
    routes() {
        this.router.post("/register", system_middleware_1.default.validateRequestBody(auth_validator_1.default.create), this.signUp.bind(this));
        this.router.post("/login", system_middleware_1.default.validateRequestBody(auth_validator_1.default.login), this.login.bind(this));
    }
}
exports.default = new AuthRoutes().router;
