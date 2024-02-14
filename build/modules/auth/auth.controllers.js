"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLoginUser = exports.httpCreateNewUser = void 0;
const catchAsync_1 = require("../../common/utils/catchAsync");
const auth_services_1 = require("./auth.services");
const user_services_1 = require("../user/user.services");
const appResponse_1 = require("../../common/utils/appResponse");
const helper_1 = require("../../common/utils/helper");
const environment_1 = require("../../common/configs/environment");
const entityTransformer_1 = require("../../common/transformers/entityTransformer");
const signup_dto_1 = require("./dto/signup.dto");
const login_dto_1 = require("./dto/login.dto");
exports.httpCreateNewUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { firstName, lastName, country, email, password, isTermsAndConditionAccepted } = req.body;
    await (0, helper_1.validateEntity)(new signup_dto_1.SignupDto({ firstName, lastName, country, email, password, isTermsAndConditionAccepted }));
    const newUser = await (0, auth_services_1.createNewUser)(firstName, lastName, country, email, password, isTermsAndConditionAccepted);
    return (0, appResponse_1.AppResponse)(res, 200, (0, entityTransformer_1.EntityTransformer)(newUser), 'User created successfully');
});
exports.httpLoginUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    await (0, helper_1.validateEntity)(new login_dto_1.LoginDto(req.body));
    const user = await (0, auth_services_1.loginUser)(email, password);
    const accessToken = (0, helper_1.signData)({ id: user.id }, environment_1.ENVIRONMENT.JWT.ACCESS_KEY, environment_1.ENVIRONMENT.JWT_EXPIRES_IN.ACCESS);
    (0, helper_1.setCookie)(res, 'accessToken', accessToken, { maxAge: 15 * 60 * 1000 });
    const refreshToken = (0, helper_1.signData)({ id: user.id }, environment_1.ENVIRONMENT.JWT.REFRESH_KEY, environment_1.ENVIRONMENT.JWT_EXPIRES_IN.REFRESH);
    (0, helper_1.setCookie)(res, 'refreshToken', refreshToken, { maxAge: 24 * 60 * 60 * 1000 });
    const updatedUser = await (0, user_services_1.updateUser)(user.id, {
        refreshToken
    });
    return (0, appResponse_1.AppResponse)(res, 200, null, 'User logged in successfully');
});
