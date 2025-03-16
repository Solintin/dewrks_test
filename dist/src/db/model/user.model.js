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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const configs_1 = require("../../configs");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { unique: true, type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("password")) {
                const salt = yield bcryptjs_1.default.genSalt(configs_1.authConfig.BCRYPT_SALT_ROUNDS);
                this.password = yield bcryptjs_1.default.hash(this.password, salt);
            }
            next();
        }
        catch (error) {
            return next(error);
        }
    });
});
UserSchema.set("toJSON", {
    transform(_, ret) {
        delete ret.password;
    },
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
