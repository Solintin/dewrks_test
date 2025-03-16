"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const joi_1 = __importDefault(require("joi"));
class AuthValidatorUtils extends index_1.BaseValidator {
    constructor() {
        super(...arguments);
        this.create = (req) => {
            const schema = joi_1.default.object({
                name: joi_1.default.string().trim().min(3).max(100).required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().trim().min(5).max(100).required(),
            });
            return this.validate(schema, req.body);
        };
        this.login = (req) => {
            const schema = joi_1.default.object({
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().trim().min(5).max(100).required(),
            });
            return this.validate(schema, req.body);
        };
    }
}
exports.default = new AuthValidatorUtils();
