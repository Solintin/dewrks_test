"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.BadRequestError = exports.UnauthorizedError = exports.ConflictError = exports.NotFoundError = exports.ApplicationError = exports.SystemError = void 0;
class SystemError extends Error {
    get code() {
        return this._code;
    }
    get errors() {
        return this._errors;
    }
    constructor(code, message = "an error occurred", errors) {
        super(message);
        this._code = code || 500;
        this.message = message;
        this._errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.SystemError = SystemError;
class ApplicationError extends SystemError {
    constructor(code, message, errors) {
        super(code, message, errors);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ApplicationError = ApplicationError;
class NotFoundError extends SystemError {
    constructor(message) {
        super(404, message || "Resource not found.");
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends SystemError {
    constructor(message) {
        super(409, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends SystemError {
    constructor(message) {
        super(401, message || "You are not authorized to access this resource.");
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestError extends SystemError {
    constructor(message) {
        super(400, message || "Bad Request");
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.BadRequestError = BadRequestError;
class ForbiddenError extends SystemError {
    constructor(message) {
        super(403, message || "Access Denied");
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ForbiddenError = ForbiddenError;
