"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const joi_1 = __importDefault(require("joi"));
const enum_interface_1 = require("../interfaces/enum.interface");
class VolunteerValidatorUtils extends index_1.BaseValidator {
    constructor() {
        super(...arguments);
        this.create = (req) => {
            const schema = joi_1.default.object({
                title: joi_1.default.string().trim().min(3).max(100).required(),
                status: joi_1.default.string().valid(...Object.values(enum_interface_1.status)),
                description: joi_1.default.string().trim().max(500).allow("").optional(),
            });
            return this.validate(schema, req.body);
        };
        this.update = (req) => {
            const schema = joi_1.default.object({
                title: joi_1.default.string().trim().min(3).max(100).optional(),
                status: joi_1.default.string()
                    .valid(...Object.values(enum_interface_1.status))
                    .optional(),
                description: joi_1.default.string().trim().max(500).allow("").optional(),
            });
            return this.validate(schema, req.body);
        };
    }
}
exports.default = new VolunteerValidatorUtils();
