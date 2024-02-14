"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpDeleteUser = exports.httpUpdateUser = exports.httpGetCurrentUser = void 0;
const appError_1 = __importDefault(require("../../common/utils/appError"));
const user_services_1 = require("./user.services");
const catchAsync_1 = require("../../common/utils/catchAsync");
const appResponse_1 = require("../../common/utils/appResponse");
const update_dto_1 = require("./dto/update.dto");
const helper_1 = require("../../common/utils/helper");
const entityTransformer_1 = require("../../common/transformers/entityTransformer");
const httpGetCurrentUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    const currentUser = await (0, user_services_1.findUser)(user.id, '_id');
    if (!currentUser)
        throw new appError_1.default('User not found', 400);
    return (0, appResponse_1.AppResponse)(res, 200, (0, entityTransformer_1.EntityTransformer)(currentUser), 'User found successfully');
});
exports.httpGetCurrentUser = httpGetCurrentUser;
const httpUpdateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    const { firstName, lastName, country, email, password, isTermsAndConditionAccepted } = req.body || null;
    if (!(firstName || lastName || country || email || password || isTermsAndConditionAccepted))
        throw new appError_1.default('No field can be empty', 400);
    const details = {
        firstName,
        lastName,
        country,
        email,
        password,
        isTermsAndConditionAccepted
    };
    await (0, helper_1.validateEntity)(new update_dto_1.UpdateUserDto(details));
    await (0, user_services_1.updateUser)(user.id, details);
    return (0, appResponse_1.AppResponse)(res, 200, null, 'User updated successfully');
});
exports.httpUpdateUser = httpUpdateUser;
const httpDeleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    const deletedUser = await (0, user_services_1.updateUser)(user.id, { isDeleted: true });
    return (0, appResponse_1.AppResponse)(res, 200, deletedUser, 'User Deleted Successfully');
});
exports.httpDeleteUser = httpDeleteUser;
