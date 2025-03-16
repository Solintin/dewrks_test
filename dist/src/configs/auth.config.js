"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class AuthConfig {
    constructor() {
        this.AUTH_SECRET = process.env.AUTH_SECRET;
        this.BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);
        this.ACCESS_TOKEN_EXPIRES_IN = "1h";
        this.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
    }
}
exports.default = new AuthConfig();
