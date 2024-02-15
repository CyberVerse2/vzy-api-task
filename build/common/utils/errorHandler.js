"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const environment_1 = require("../configs/environment");
const logger_1 = require("./logger");
const appError_1 = __importDefault(require("./appError"));
const class_validator_1 = require("class-validator");
function handleValidationError(err) {
    return new appError_1.default(err.value, 400);
}
/**
 * Error handler
 */
const handleError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something went wrong';
    err.data = err.data || null;
    const { statusCode, message, data } = err;
    logger_1.logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (err.timeout) {
        return res.status(408).send({
            success: false,
            data: null,
            message: 'Request timeout'
        });
    }
    if (statusCode === 404) {
        return res.status(statusCode).json({
            success: false,
            data: null,
            message: message ?? 'resource not found'
        });
    }
    if (err instanceof class_validator_1.ValidationError) {
        err = handleValidationError(err);
    }
    if (environment_1.ENVIRONMENT.APP.ENV === 'local') {
        console.log('==== Error ==== : ', err.stack);
        return res.status(statusCode).json({
            success: false,
            data: data,
            message: message,
            stackTrace: err.stack
        });
    }
    return res.status(statusCode).json({
        success: false,
        data: data,
        message: message
    });
};
exports.handleError = handleError;
