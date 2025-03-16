"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("../configs");
const logger_1 = __importDefault(require("../utils/logger"));
class DB {
    constructor() {
        this.options = {
            autoIndex: configs_1.serverConfig.NODE_ENV === "development",
        };
    }
    connectDB(dbUri) {
        return __awaiter(this, void 0, void 0, function* () {
            mongoose_1.default.set("strictQuery", false);
            const { connection } = yield mongoose_1.default.connect(dbUri, this.options);
            this.connection = connection;
            this.connection.on("disconnected", () => {
                logger_1.default.debug("MongoDB connection closed");
            });
            return this.connection;
        });
    }
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection)
                yield this.connection.close();
        });
    }
}
exports.default = new DB();
