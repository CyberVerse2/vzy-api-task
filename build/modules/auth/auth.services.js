"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createNewUser = void 0;
const appError_1 = __importDefault(require("./../../common/utils/appError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const helper_1 = require("../../common/utils/helper");
const user_services_1 = require("../user/user.services");
async function createNewUser(firstName, lastName, country, email, password, isTermsAndConditionAccepted) {
    const user = await (0, user_services_1.findUser)(email, 'email');
    if (user) {
        throw new appError_1.default('User already exists', 409);
    }
    const newUser = await user_model_1.default.create({
        firstName,
        lastName,
        country,
        email,
        password,
        isTermsAndConditionAccepted
    });
    if (!newUser)
        throw new appError_1.default('Error in creating user. Please try again', 400);
    return newUser;
}
exports.createNewUser = createNewUser;
async function loginUser(email, password) {
    const authenticatedUser = await (0, user_services_1.findUser)(email, 'email');
    if (!authenticatedUser) {
        throw new appError_1.default('User not found', 404);
    }
    const isValidUser = await (0, helper_1.compareData)(password, authenticatedUser.password);
    if (!isValidUser) {
        throw new appError_1.default('The password is incorrect', 401);
    }
    return authenticatedUser;
}
exports.loginUser = loginUser;
