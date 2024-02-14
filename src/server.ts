import { ENVIRONMENT } from './common/configs/environment';
import './common/interfaces/authRequest';
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import AppError from './common/utils/appError';
import api from './api';
import rateLimit from 'express-rate-limit';
import { handleError } from './common/utils/errorHandler';
import cors from 'cors';
import helmet from 'helmet';
import { stream } from './common/utils/logger';
import morgan from 'morgan';
import { AppResponse } from './common/utils/appResponse';
import { initializeDB } from './common/configs/db';
import { catchAsync } from './common/utils/catchAsync';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import stripe from 'stripe';
import { updateUser } from './modules/user/user.services';
import { protect } from './common/middlewares/protect';
/**
 * Default app configurations
 */
const app = express();
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;
const stripeApp = new stripe(ENVIRONMENT.STRIPE.TEST.SECRET_KEY);

/**
 * App Security
 */
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.disable('x-powered-by');
const timeoutMiddleware = timeout(60000);

const limiter = rateLimit({
  windowMs: 60 * 1000 * 15, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

/**
 * Logger Middleware
 */
app.use(morgan(ENVIRONMENT.APP.ENV !== 'local' ? 'combined' : 'dev', { stream }));

// append request time to all request
app.use((req, res, next) => {
  req['requestTime'] = new Date().toISOString();
  next();
});

/**
 * Initialize routes
 */
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.all(
  '*',
  catchAsync(async (req: Request) => {
    throw new AppError('route not found', 404);
  })
);

/**
 * Error handler middlewares
 */
app.use(timeoutMiddleware);
app.use(handleError);

/**
 * status check
 */
app.get('*', (req, res) =>
  res.send({
    Time: new Date(),
    status: 'running'
  })
);

const endpointSecret = 'whsec_df2f22219bce3e4b8c70bb49a85f8a065149e4ff2d591283b7c303ae185504b7';

app.post('/webhook', protect, async (req, res) => {
  const { user } = req;
  const sig = req.headers['stripe-signature'];

  let event: stripe.Event;

  try {
    event = stripeApp.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  // Handle the event
  if (event.type === 'charge.succeeded') {
    const chargeSucceeded = event.data.object;
    console.log(chargeSucceeded);
    const updatedUser = await updateUser(user.id!, {
      paymentStatus: 'paid'
    });

    if (!updatedUser) throw new AppError(`Error in updating user`);
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return AppResponse(res, 200, null, 'User payment successful');
});

/**
 * Bootstrap server
 */
app.listen(port, () => {
  console.log('=> ' + appName + ' app listening on port ' + port + '!');
  initializeDB();
});
