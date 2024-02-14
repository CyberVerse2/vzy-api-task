"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENVIRONMENT = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.ENVIRONMENT = {
    APP: {
        NAME: process.env.APP_NAME,
        PORT: parseInt(process.env.PORT || '3000'),
        ENV: process.env.APP_ENV
    },
    DB: {
        URL: process.env.DB
    },
    JWT: {
        ACCESS_KEY: process.env.ACCESS_JWT_KEY,
        REFRESH_KEY: process.env.REFRESH_JWT_KEY
    },
    JWT_EXPIRES_IN: {
        ACCESS: process.env.ACCESS_JWT_EXPIRES_IN,
        REFRESH: process.env.REFRESH_JWT_EXPIRES_IN
    },
    STRIPE: {
        TEST: {
            SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY,
            PUBLIC_KEY: process.env.STRIPE_TEST_PUBLIC_KEY,
            WEBHOOK: process.env.STRIPE_TEST_WEBHOOK_SECRET_KEY
        },
        LIVE: {
            SECRET_KEY: process.env.STRIPE_LIVE_SECRET_KEY,
            PUBLIC_KEY: process.env.STRIPE_LIVE_PUBLIC_KEY,
            WEBHOOK: process.env.STRIPE_LIVE_WEBHOOK_URL
        }
    }
};
