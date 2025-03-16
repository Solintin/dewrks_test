"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const configs_1 = require("../configs");
const mongoose_1 = __importDefault(require("mongoose"));
const errors_1 = require("../errors");
const express_rate_limit_1 = require("express-rate-limit");
class SystemMiddlewares {
    constructor() {
        this.validateParamId = (param) => {
            return (req, _res, next) => {
                try {
                    const { params } = req;
                    if (!req.paramIds) {
                        req.paramIds = {};
                    }
                    if (!mongoose_1.default.Types.ObjectId.isValid(params[param])) {
                        throw new errors_1.BadRequestError(`Invalid ${param}`);
                    }
                    req.paramIds[param] = new mongoose_1.default.Types.ObjectId(params[param]);
                    return next();
                }
                catch (err) {
                    next(err);
                }
            };
        };
        this.filterMiddleware = (req, _, next) => {
            const filters = {};
            const pageOpt = {};
            for (const key in req.query) {
                const value = req.query[key];
                if (!value)
                    continue;
                if (key === "limit")
                    pageOpt.limit = Math.max(1, parseInt(value, 10) || 10);
                else if (key === "page")
                    pageOpt.page = Math.max(1, parseInt(value, 10) || 1);
                else if (key === "sortBy")
                    pageOpt.sort.field = value;
                else if (key === "sortOrder" && (value === "asc" || value === "desc"))
                    pageOpt.sort.order = value;
                else {
                    filters[key] = { $regex: new RegExp(value, "i") };
                }
            }
            req.filters = filters;
            req.pageOpt = pageOpt;
            next();
        };
        this.validateRequestBody = (validator) => {
            return (req, _res, next) => {
                const { error, value } = validator(req);
                if (error)
                    next(error);
                req.body = value;
                next();
            };
        };
        this.rateLimiter = () => {
            return (0, express_rate_limit_1.rateLimit)({
                windowMs: 1 * 60 * 1000,
                limit: configs_1.serverConfig.MAX_REQUESTS_PER_MINUTE,
                standardHeaders: "draft-7",
                legacyHeaders: false,
                message: () => {
                    throw new errors_1.ApplicationError(429, "You are hitting me too fast");
                },
            });
        };
    }
    errorHandler() {
        return (error, _req, res, next) => {
            const isProduction = configs_1.serverConfig.NODE_ENV === "production";
            const errorCode = error.code || 500;
            let errorMessage = {};
            if (res.headersSent) {
                return next(error);
            }
            if (!isProduction) {
                errorMessage = error;
            }
            if (error instanceof joi_1.default.ValidationError) {
                res.status(400).json({
                    message: "Validation error.",
                    error: error.details.map((detail) => detail.message),
                });
                return;
            }
            if (errorCode === 500 && isProduction) {
                res.status(500).json({
                    message: "An unexpected error occurred. Please try again later.",
                });
                return;
            }
            res.status(errorCode).json({
                message: error.message,
                error: Object.assign(Object.assign({}, (error.errors && { error: error.errors })), (!isProduction && { trace: errorMessage })),
            });
            return;
        };
    }
}
exports.default = new SystemMiddlewares();
