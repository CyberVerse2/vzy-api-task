"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const helper_1 = require("../../common/utils/helper");
const User = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    refreshToken: String,
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending'],
        default: 'pending'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    isTermsAndConditionAccepted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
User.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await (0, helper_1.hashData)(user.password);
    }
    next();
});
const UserModel = (0, mongoose_1.model)('User', User);
exports.default = UserModel;
