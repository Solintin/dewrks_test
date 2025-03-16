"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class DBConfig {
    constructor() {
        this.DB_URI = process.env.MONGO_URI;
    }
}
exports.default = new DBConfig();
