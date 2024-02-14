"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const authenticate_1 = require("../utils/authenticate");
const catchAsync_1 = require("../utils/catchAsync");
const helper_1 = require("../utils/helper");
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    const { currentUser, newAccessToken } = await (0, authenticate_1.authenticate)(accessToken, refreshToken);
    if (newAccessToken) {
        (0, helper_1.setCookie)(res, 'accessToken', newAccessToken, { maxAge: 15 * 60 * 1000 });
    }
    if (currentUser) {
        req.user = { id: currentUser._id?.toString() };
    }
    next();
});
