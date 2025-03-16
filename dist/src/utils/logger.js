"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const configs_1 = require("../configs");
const logFormat = winston_1.default.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});
const logger = winston_1.default.createLogger({
    level: configs_1.serverConfig.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.colorize(), logFormat),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston_1.default.transports.File({ filename: "logs/combined.log" }),
    ],
});
exports.default = logger;
