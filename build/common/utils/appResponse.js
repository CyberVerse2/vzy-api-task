"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppResponse = void 0;
function AppResponse(res, statusCode = 200, data, message) {
    res.status(statusCode).json({
        status: "success",
        message: message ?? "Success",
        data: data ?? null,
    });
}
exports.AppResponse = AppResponse;
