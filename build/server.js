"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./common/configs/environment");
require("./common/interfaces/authRequest");
const express_1 = __importDefault(require("express"));
const appError_1 = __importDefault(require("./common/utils/appError"));
const api_1 = __importDefault(require("./api"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorHandler_1 = require("./common/utils/errorHandler");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const logger_1 = require("./common/utils/logger");
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./common/configs/db");
const catchAsync_1 = require("./common/utils/catchAsync");
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const stripe_1 = __importDefault(require("stripe"));
/**
 * Default app configurations
 */
const app = (0, express_1.default)();
const port = environment_1.ENVIRONMENT.APP.PORT;
const appName = environment_1.ENVIRONMENT.APP.NAME;
const stripeApp = new stripe_1.default(environment_1.ENVIRONMENT.STRIPE.TEST.SECRET_KEY);
/**
 * App Security
 */
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/webhook') {
        console.log(req.originalUrl);
        next();
    }
    else {
        console.log('This is where the error is happening');
        express_1.default.json()(req, res, next);
    }
});
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.disable('x-powered-by');
const timeoutMiddleware = (0, connect_timeout_1.default)(60000);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000 * 15, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
/**
 * Logger Middleware
 */
app.use((0, morgan_1.default)(environment_1.ENVIRONMENT.APP.ENV !== 'local' ? 'combined' : 'dev', { stream: logger_1.stream }));
// append request time to all request
app.use((req, res, next) => {
    req['requestTime'] = new Date().toISOString();
    next();
});
/**
 * Initialize routes
 */
app.use('/api/v1', api_1.default);
// catch 404 and forward to error handler
app.all('*', (0, catchAsync_1.catchAsync)(async (req) => {
    throw new appError_1.default('route not found', 404);
}));
/**
 * Error handler middlewares
 */
app.use(timeoutMiddleware);
app.use(errorHandler_1.handleError);
/**
 * status check
 */
app.get('/', (req, res) => res.send({
    Time: new Date(),
    status: 'running'
}));
/**
 * Bootstrap server
 */
app.listen(port, () => {
    console.log('=> ' + appName + ' app listening on port ' + port + '!');
    (0, db_1.initializeDB)();
});
