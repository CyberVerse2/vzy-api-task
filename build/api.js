"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./modules/auth/auth.router"));
const user_router_1 = __importDefault(require("./modules/user/user.router"));
const api = (0, express_1.Router)();
api.use('/auth', auth_router_1.default);
api.use('/user', user_router_1.default);
exports.default = api;
