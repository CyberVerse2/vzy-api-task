"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEntity = exports.setCookie = exports.decodeData = exports.signData = exports.compareData = exports.hashData = exports.generateRandomString = void 0;
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const environment_1 = require("../configs/environment");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const class_validator_1 = require("class-validator");
const appError_1 = __importDefault(require("./appError"));
const generateRandomString = () => {
    return (0, crypto_1.randomBytes)(10).toString('hex');
};
exports.generateRandomString = generateRandomString;
const hashData = async (data) => {
    const hashedData = await (0, bcrypt_1.hash)(data, 10);
    return hashedData;
};
exports.hashData = hashData;
const compareData = async (data, hashedData) => {
    const isValid = await (0, bcrypt_1.compare)(data, hashedData);
    return isValid;
};
exports.compareData = compareData;
const signData = (data, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign({ ...data }, secret, {
        expiresIn
    });
};
exports.signData = signData;
const decodeData = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.decodeData = decodeData;
const setCookie = (res, name, value, options = {}) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: environment_1.ENVIRONMENT.APP.ENV === 'production',
        path: '/',
        sameSite: 'none',
        ...options
    });
};
exports.setCookie = setCookie;
const validateEntity = async (dto) => {
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length > 0) {
        const errorMap = [];
        errors.forEach((item) => {
            for (const constraint of Object.values(item.constraints)) {
                errorMap.push(constraint);
            }
        });
        throw new appError_1.default('Validation error', 400, errorMap);
    }
};
exports.validateEntity = validateEntity;
