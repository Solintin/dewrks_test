"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class ServerConfig {
    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || "development";
        this.HOST = process.env.HOST || "localhost";
        this.PORT = process.env.PORT;
        this.APP_VERSION = process.env.APP_VERSION;
        this.BASE_URL = `${this.HOST}/v${this.APP_VERSION}`;
        this.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
        this.MAX_REQUESTS_PER_MINUTE = Number(process.env.MAX_REQUESTS_PER_MINUTE);
    }
}
exports.default = new ServerConfig();
