"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./modules/auth/auth.router"));
const user_router_1 = __importDefault(require("./modules/user/user.router"));
const stripe_1 = __importDefault(require("stripe"));
const user_services_1 = require("./modules/user/user.services");
const protect_1 = require("./common/middlewares/protect");
const environment_1 = require("./common/configs/environment");
const appError_1 = __importDefault(require("./common/utils/appError"));
const appResponse_1 = require("./common/utils/appResponse");
const api = (0, express_1.Router)();
api.use('/auth', auth_router_1.default);
api.use('/user', user_router_1.default);
const endpointSecret = environment_1.ENVIRONMENT.STRIPE.TEST.WEBHOOK;
const stripeApp = new stripe_1.default(environment_1.ENVIRONMENT.STRIPE.TEST.SECRET_KEY);
api.post('/webhook', protect_1.protect, async (req, res) => {
    const { user } = req;
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripeApp.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err}`);
        return;
    }
    // Handle the event
    if (event.type === 'charge.succeeded') {
        const chargeSucceeded = event.data.object;
        console.log(chargeSucceeded);
        const updatedUser = await (0, user_services_1.updateUser)(user.id, {
            paymentStatus: 'paid'
        });
        if (!updatedUser)
            throw new appError_1.default(`Error in updating user`);
    }
    else {
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    return (0, appResponse_1.AppResponse)(res, 200, null, 'User payment successful');
});
exports.default = api;
