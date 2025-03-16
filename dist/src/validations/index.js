"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joi = exports.BaseValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importStar(require("mongoose"));
class BaseValidator {
    constructor() {
        this.validationOption = {
            errors: {
                wrap: {
                    label: "",
                },
            },
            abortEarly: false,
        };
        this.patterns = {
            phoneNumber: /^(?:\+234|0)(?:70|80|81|90|91)\d{8}$/,
        };
        this.validate = (schema, payload) => {
            return schema.validate(payload, this.validationOption);
        };
    }
}
exports.BaseValidator = BaseValidator;
exports.Joi = joi_1.default.extend((joi) => ({
    type: "objectId",
    base: joi.string(),
    messages: {
        "objectId.invalid": "{{#label}} must be a valid {{#label}} Id",
    },
    validate(value, helpers) {
        if (!(0, mongoose_1.isValidObjectId)(value)) {
            return {
                value: new mongoose_1.default.Types.ObjectId(value),
                errors: helpers.error("objectId.invalid"),
            };
        }
    },
}));
