"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = exports.serverConfig = exports.dbConfig = void 0;
const db_config_1 = __importDefault(require("./db.config"));
exports.dbConfig = db_config_1.default;
const server_config_1 = __importDefault(require("./server.config"));
exports.serverConfig = server_config_1.default;
const auth_config_1 = __importDefault(require("./auth.config"));
exports.authConfig = auth_config_1.default;
