"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.findUser = void 0;
const appError_1 = __importDefault(require("./../../common/utils/appError"));
const user_model_1 = __importDefault(require("../user/user.model"));
async function findUser(value, field) {
    return await user_model_1.default.findOne({ [field]: value });
}
exports.findUser = findUser;
async function updateUser(id, details) {
    const updatedUser = await user_model_1.default.findByIdAndUpdate(id, details, { new: true });
    if (!updatedUser)
        throw new appError_1.default(`Error in updating user. Please try again`, 400);
    return updatedUser;
}
exports.updateUser = updateUser;
