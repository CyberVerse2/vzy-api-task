"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const authRouter = (0, express_1.Router)();
authRouter.post("/signup", auth_controllers_1.httpCreateNewUser);
authRouter.post("/login", auth_controllers_1.httpLoginUser);
exports.default = authRouter;
