"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDB = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const environment_1 = require("./environment");
const mongoose_1 = __importDefault(require("mongoose"));
const initializeDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(environment_1.ENVIRONMENT.DB.URL);
        console.log('MongoDB Connected: ' + conn.connection.host);
    }
    catch (error) {
        throw new appError_1.default(error);
    }
};
exports.initializeDB = initializeDB;
