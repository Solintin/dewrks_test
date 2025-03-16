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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const logger_1 = __importDefault(require("../utils/logger"));
class AuthController {
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: signUpData } = req;
                console.log(signUpData);
                console.log(req);
                const user = yield auth_service_1.default.signUp(signUpData);
                const data = yield auth_service_1.default.login(user);
                return res.status(201).json({
                    message: "Welcome Boss",
                    data,
                });
            }
            catch (error) {
                logger_1.default.log("error", `Error in auth signup controller method: ${error}`);
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: { email, password }, } = req;
                const user = yield auth_service_1.default.getUserForLogin(email, password);
                const data = yield auth_service_1.default.login(user);
                return res.status(200).json({
                    message: "Logged in successfully.",
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthController;
