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
const errors_1 = require("../errors");
const auth_service_1 = __importDefault(require("../services/auth.service"));
const logger_1 = __importDefault(require("../utils/logger"));
class AuthenticationMiddleware {
    validateUserAccess(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                if (!authorization)
                    throw new errors_1.BadRequestError("No token provided.");
                let token;
                if (authorization.startsWith("Bearer ")) {
                    [, token] = authorization.split(" ");
                }
                else {
                    token = authorization;
                }
                if (!token)
                    throw new errors_1.BadRequestError("No token provided.");
                const { payload, expired } = auth_service_1.default.verifyAccessToken(token);
                if (expired)
                    throw new errors_1.UnauthorizedError("Please provide a valid token.");
                req.user = payload;
                return next();
            }
            catch (error) {
                logger_1.default.log("error", `Error in authentication middleware validate user access method: ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new AuthenticationMiddleware();
