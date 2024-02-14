"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const appError_1 = __importDefault(require("./appError"));
const user_model_1 = __importDefault(require("../../modules/user/user.model"));
const helper_1 = require("./helper");
const environment_1 = require("../configs/environment");
const jsonwebtoken_1 = require("jsonwebtoken");
async function authenticate(accessToken, refreshToken) {
    if (!refreshToken) {
        throw new appError_1.default('Unauthorized', 401);
    }
    const handleUserVerification = async (decoded) => {
        const currentUser = await user_model_1.default.findById(decoded.id).select('+refreshToken +id');
        if (!currentUser) {
            throw new appError_1.default(`This user doesn't exist`, 404);
        }
        if (currentUser?.refreshToken !== refreshToken) {
            throw new appError_1.default('Invalid token, Please log in again', 401);
        }
        return currentUser;
    };
    const handleAccessTokenRefresh = async () => {
        const decodedRefreshToken = (0, helper_1.decodeData)(refreshToken, environment_1.ENVIRONMENT.JWT.REFRESH_KEY);
        const currentUser = await handleUserVerification(decodedRefreshToken);
        const newAccessToken = (0, helper_1.signData)({ id: currentUser.id }, environment_1.ENVIRONMENT.JWT.ACCESS_KEY, environment_1.ENVIRONMENT.JWT_EXPIRES_IN.ACCESS);
        if (newAccessToken) {
            return { newAccessToken, currentUser: currentUser.toObject() };
        }
        return { currentUser: currentUser.toObject() };
    };
    try {
        if (!accessToken) {
            return await handleAccessTokenRefresh();
        }
        const decodedAccessToken = (0, helper_1.decodeData)(accessToken, environment_1.ENVIRONMENT.JWT.ACCESS_KEY);
        const currentUser = await handleUserVerification(decodedAccessToken);
        return { currentUser: currentUser.toObject() };
    }
    catch (error) {
        if ((error instanceof jsonwebtoken_1.JsonWebTokenError ||
            error instanceof jsonwebtoken_1.TokenExpiredError ||
            error instanceof appError_1.default) &&
            refreshToken) {
            return await handleAccessTokenRefresh();
        }
        else {
            console.log(error);
            throw new appError_1.default('Session Expired, please log in again', 401);
        }
    }
}
exports.authenticate = authenticate;
