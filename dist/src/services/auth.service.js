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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const user_model_1 = __importDefault(require("../db/model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const base_service_1 = __importDefault(require("./base.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AuthService extends base_service_1.default {
    constructor() {
        super("User", user_model_1.default);
        this.UserModel = user_model_1.default;
        this.AuthEncryptKey = fs_1.default
            .readFileSync(path_1.default.join(process.cwd(), "private.key"))
            .toString();
    }
    signUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield this.UserModel.findOne({
                email: data.email,
            });
            if (isExist) {
                throw new errors_1.BadRequestError("User already exist");
            }
            const newUser = new this.UserModel(Object.assign({}, data));
            yield newUser.save();
            return newUser;
        });
    }
    getUserForLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserModel.findOne({ email }).select("+password");
            if (!user || !this.validatePassword(user, password)) {
                throw new errors_1.BadRequestError("Email or password is incorrect");
            }
            return user;
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = user.toObject(), { password } = _a, userPayload = __rest(_a, ["password"]);
            const accessToken = this.generateAccessToken(userPayload);
            return { user, accessToken };
        });
    }
    validatePassword(user, password) {
        try {
            return bcryptjs_1.default.compareSync(password, user.password);
        }
        catch (error) {
            return false;
        }
    }
    generateAccessToken(user) {
        const accessToken = jsonwebtoken_1.default.sign(Object.assign({}, user), this.AuthEncryptKey, {
            algorithm: "RS256",
            expiresIn: "1h",
        });
        return accessToken;
    }
    verifyAccessToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, this.AuthEncryptKey);
            return {
                payload,
                expired: false,
            };
        }
        catch (error) {
            return {
                payload: null,
                expired: error.message.includes("expired") ? error.message : error,
            };
        }
    }
}
exports.default = new AuthService();
