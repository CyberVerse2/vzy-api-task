"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_custom_error_1 = require("ts-custom-error");
class AppError extends ts_custom_error_1.CustomError {
    statusCode;
    status;
    isOperational;
    data;
    constructor(message, statusCode = 400, data) {
        super(message);
        // Object.setPrototypeOf(this, AppError.prototype);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("5") ? "Failed" : "Error";
        this.isOperational = true;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
